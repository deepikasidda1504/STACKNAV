from flask import Flask, render_template, redirect, jsonify, request
import os

app = Flask(__name__)


# =====================================================
# CORS
# =====================================================

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


# =====================================================
# USER SESSIONS
# =====================================================
#
# Each Chrome extension installation/user gets a
# unique client_id.
#
# This prevents different users from sharing:
#   - Back Stack
#   - Forward Stack
#   - Current Page
#   - Operation Log
#
# =====================================================

sessions = {}


# =====================================================
# GET / CREATE USER SESSION
# =====================================================

def get_session(client_id):
    """
    Return the session belonging to this client.

    If the client does not exist yet, create a new one.
    """

    if not client_id:
        client_id = "default"

    if client_id not in sessions:

        sessions[client_id] = {
            "back_stack": [],
            "forward_stack": [],
            "current_page": "Home",
            "operation_log": []
        }

    return sessions[client_id]


# =====================================================
# GET CLIENT ID
# =====================================================

def get_client_id():
    """
    Read client_id from the URL query parameter.
    """

    client_id = request.args.get(
        "client_id",
        "default"
    )

    client_id = client_id.strip()

    if not client_id:
        client_id = "default"

    return client_id


# =====================================================
# RECORD OPERATION
# =====================================================

def record_operation(session, operation, page):

    session["operation_log"].append({

        "operation": operation,

        "page": page

    })

    # Keep latest 20 operations
    if len(session["operation_log"]) > 20:

        session["operation_log"].pop(0)


# =====================================================
# VISIT A COMPLETELY NEW PAGE
# =====================================================

def visit_page(session, page):

    # Same page = nothing to do
    if page == session["current_page"]:

        return False


    # -------------------------------------------------
    # CURRENT PAGE → BACK STACK
    # -------------------------------------------------

    session["back_stack"].append(
        session["current_page"]
    )

    record_operation(
        session,
        "PUSH",
        session["current_page"]
    )


    # -------------------------------------------------
    # NEW PAGE ALWAYS CLEARS FORWARD STACK
    # -------------------------------------------------

    if session["forward_stack"]:

        session["forward_stack"].clear()

        record_operation(
            session,
            "CLEAR",
            "Forward Stack"
        )


    # -------------------------------------------------
    # NEW PAGE → CURRENT
    # -------------------------------------------------

    session["current_page"] = page

    record_operation(
        session,
        "VISIT",
        page
    )

    return True


# =====================================================
# GO BACK
# =====================================================

def go_back(session):

    # No previous page
    if not session["back_stack"]:

        return False


    # -------------------------------------------------
    # CURRENT → FORWARD STACK
    # -------------------------------------------------

    session["forward_stack"].append(
        session["current_page"]
    )

    record_operation(
        session,
        "PUSH",
        session["current_page"]
    )


    # -------------------------------------------------
    # BACK STACK → CURRENT
    # -------------------------------------------------

    previous_page = session["back_stack"].pop()

    session["current_page"] = previous_page

    record_operation(
        session,
        "POP",
        session["current_page"]
    )

    return True


# =====================================================
# GO FORWARD
# =====================================================

def go_forward(session):

    # No forward page
    if not session["forward_stack"]:

        return False


    # -------------------------------------------------
    # CURRENT → BACK STACK
    # -------------------------------------------------

    session["back_stack"].append(
        session["current_page"]
    )

    record_operation(
        session,
        "PUSH",
        session["current_page"]
    )


    # -------------------------------------------------
    # FORWARD STACK → CURRENT
    # -------------------------------------------------

    next_page = session["forward_stack"].pop()

    session["current_page"] = next_page

    record_operation(
        session,
        "POP",
        session["current_page"]
    )

    return True


# =====================================================
# HOME PAGE
# =====================================================

@app.route("/")
def home():

    session = get_session(
        get_client_id()
    )

    return render_template(

        "index.html",

        current_page=session["current_page"],

        back_history=session["back_stack"],

        forward_history=session["forward_stack"]

    )


# =====================================================
# VISIT WEBSITE
# =====================================================

@app.route("/visit/<page>")
def visit(page):

    pages = {

        "Google":
            "https://www.google.com",

        "YouTube":
            "https://www.youtube.com",

        "Instagram":
            "https://www.instagram.com",

        "GitHub":
            "https://github.com"

    }


    if page in pages:

        return redirect(
            pages[page]
        )


    return redirect("/")


# =====================================================
# SYNCHRONIZE CHROME NAVIGATION
#
# action:
#   new
#   back
#   forward
# =====================================================

@app.route("/sync_navigation/<page>")
def sync_navigation(page):

    client_id = get_client_id()

    session = get_session(
        client_id
    )

    action = request.args.get(
        "action",
        "new"
    ).lower().strip()


    print(
        "SYNC:",
        page,
        "ACTION:",
        action,
        "CLIENT:",
        client_id
    )


    # =================================================
    # NEW PAGE
    # =================================================

    if action == "new":

        changed = visit_page(
            session,
            page
        )

        return jsonify({

            "success": True,

            "changed": changed,

            "action": "new",

            "current_page":
                session["current_page"],

            "back_stack":
                session["back_stack"],

            "forward_stack":
                session["forward_stack"]

        })


    # =================================================
    # BACK
    # =================================================

    elif action == "back":

        success = go_back(
            session
        )

        return jsonify({

            "success": success,

            "action": "back",

            "current_page":
                session["current_page"],

            "back_stack":
                session["back_stack"],

            "forward_stack":
                session["forward_stack"]

        })


    # =================================================
    # FORWARD
    # =================================================

    elif action == "forward":

        success = go_forward(
            session
        )

        return jsonify({

            "success": success,

            "action": "forward",

            "current_page":
                session["current_page"],

            "back_stack":
                session["back_stack"],

            "forward_stack":
                session["forward_stack"]

        })


    # =================================================
    # UNKNOWN ACTION
    # =================================================

    return jsonify({

        "success": False,

        "error":
            "Unknown navigation action: " + action,

        "current_page":
            session["current_page"],

        "back_stack":
            session["back_stack"],

        "forward_stack":
            session["forward_stack"]

    }), 400


# =====================================================
# BACK BUTTON
# =====================================================

@app.route("/back")
def back():

    session = get_session(
        get_client_id()
    )

    go_back(session)

    return render_template(

        "index.html",

        current_page=session["current_page"],

        back_history=session["back_stack"],

        forward_history=session["forward_stack"]

    )


# =====================================================
# FORWARD BUTTON
# =====================================================

@app.route("/forward")
def forward():

    session = get_session(
        get_client_id()
    )

    go_forward(session)

    return render_template(

        "index.html",

        current_page=session["current_page"],

        back_history=session["back_stack"],

        forward_history=session["forward_stack"]

    )


# =====================================================
# STACK STATE
# =====================================================

@app.route("/stack_state")
def stack_state():

    session = get_session(
        get_client_id()
    )

    return jsonify({

        "current_page":
            session["current_page"],

        "back_stack":
            session["back_stack"],

        "forward_stack":
            session["forward_stack"]

    })


# =====================================================
# OPERATION LOG
# =====================================================

@app.route("/operation_log")
def operation_log_route():

    session = get_session(
        get_client_id()
    )

    return jsonify({

        "operations":
            session["operation_log"]

    })


# =====================================================
# STACK STATISTICS
# =====================================================

@app.route("/stack_statistics")
def stack_statistics():

    session = get_session(
        get_client_id()
    )

    return jsonify({

        "back_count":
            len(session["back_stack"]),

        "forward_count":
            len(session["forward_stack"]),

        "total_operations":
            len(session["operation_log"]),

        # Include current page
        "total_pages":
            len(session["back_stack"])
            + len(session["forward_stack"])
            + 1

    })


# =====================================================
# RESET STACK
# =====================================================

@app.route("/reset")
def reset():

    client_id = get_client_id()

    session = get_session(
        client_id
    )

    session["back_stack"].clear()

    session["forward_stack"].clear()

    session["operation_log"].clear()

    session["current_page"] = "Home"

    return jsonify({

        "success": True,

        "message":
            "Stack reset successfully",

        "current_page":
            session["current_page"],

        "back_stack":
            session["back_stack"],

        "forward_stack":
            session["forward_stack"]

    })


# =====================================================
# START FLASK SERVER
# =====================================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=int(
            os.environ.get(
                "PORT",
                5000
            )
        ),

        debug=False

    )