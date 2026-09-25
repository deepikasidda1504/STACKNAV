from flask import Flask, render_template, redirect, jsonify
import os
app = Flask(__name__)

# =====================================================
# TWO STACKS
# =====================================================

back_stack = []
forward_stack = []
# ============================================
# OPERATION LOG
# ============================================

operation_log = []
# Current page
current_page = "Home"
# ============================================
# RECORD OPERATION
# ============================================

def record_operation(operation, page):

    operation_log.append({

        "operation": operation,

        "page": page

    })

    # Keep only the latest 20 operations
    if len(operation_log) > 20:

        operation_log.pop(0)


# =====================================================
# VISIT A NEW PAGE
# =====================================================

def visit_page(page):

    global current_page

    # PUSH current page into Back Stack
    back_stack.append(current_page)

    record_operation(
        "PUSH",
        current_page
    )

    # New page clears Forward Stack
    if forward_stack:

        forward_stack.clear()

        record_operation(
            "CLEAR",
            "Forward Stack"
        )

    # Set new current page
    current_page = page
# =====================================================
# GO BACK
# =====================================================

def go_back():

    global current_page

    # Check if Back Stack is empty
    if not back_stack:
        return False

    # Move current page to Forward Stack
    forward_stack.append(current_page)

    # Take previous page from Back Stack
    current_page = back_stack.pop()

    # Record operation
    record_operation("POP", current_page)

    return True
# =====================================================
# GO FORWARD
# =====================================================

def go_forward():

    global current_page

    # Check if Forward Stack is empty
    if not forward_stack:
        return False

    # Move current page to Back Stack
    back_stack.append(current_page)

    # Take next page from Forward Stack
    current_page = forward_stack.pop()

    # Record operation
    record_operation("POP", current_page)

    return True

# =====================================================
# HOME PAGE
# =====================================================

@app.route("/")
def home():

    return render_template(
        "index.html",
        current_page=current_page,
        back_history=back_stack,
        forward_history=forward_stack
    )


# =====================================================
# VISIT A NEW PAGE
# =====================================================

@app.route("/visit/<page>")
def visit(page):

    # Real website URLs
    pages = {

        "Google": "https://www.google.com",

        "YouTube": "https://www.youtube.com",

        "Instagram": "https://www.instagram.com",

        "GitHub": "https://github.com"
    }

    # Open website in the same Chrome tab
    if page in pages:

        return redirect(pages[page])

    # If page is not found
    return redirect("/")


# =====================================================
# SYNCHRONIZE CHROME NAVIGATION WITH PYTHON
# =====================================================

@app.route("/sync_navigation/<page>")
def sync_navigation(page):

    # If Chrome is already on this page
    if page == current_page:

        return "Already on current page"


    # If page exists in Back Stack
    # Chrome probably moved backward
    if page in back_stack:

        go_back()


    # If page exists in Forward Stack
    # Chrome probably moved forward
    elif page in forward_stack:

        go_forward()


    # Otherwise it is a new page
    else:

        visit_page(page)


    return "Navigation synchronized"


# =====================================================
# BACK BUTTON
# =====================================================

@app.route("/back")
def back():

    go_back()

    return render_template(
        "index.html",
        current_page=current_page,
        back_history=back_stack,
        forward_history=forward_stack
    )


# =====================================================
# FORWARD BUTTON
# =====================================================

@app.route("/forward")
def forward():

    go_forward()

    return render_template(
        "index.html",
        current_page=current_page,
        back_history=back_stack,
        forward_history=forward_stack
    )


# =====================================================
# SEND STACK INFORMATION TO CHROME EXTENSION
# =====================================================

@app.route("/stack_state")
def stack_state():

    return jsonify({

        "current_page": current_page,

        "back_stack": back_stack,

        "forward_stack": forward_stack

    })
# =====================================================
# OPERATION LOG
# =====================================================

@app.route("/operation_log")
def operation_log_route():

    return jsonify({
        "operations": operation_log
    })


# =====================================================
# STACK STATISTICS
# =====================================================

@app.route("/stack_statistics")
def stack_statistics():

    return jsonify({

        "back_count": len(back_stack),

        "forward_count": len(forward_stack),

        "total_operations": len(operation_log),

        "total_pages": len(back_stack) + len(forward_stack)

    })# =====================================================
# START FLASK SERVER
# =====================================================

if __name__ == "__main__":

   app.run(
    host="0.0.0.0",
    port=int(os.environ.get("PORT", 5000)),
    debug=False
)