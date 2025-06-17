from flask import Flask, request, jsonify, render_template_string
import os
app = Flask(__name__)

# Main form HTML template
form_html = r"""
<!doctype html>
<html>
<head>
    <title>Registration Form</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .error-feedback {
            display: none;
            color: red;
            font-size: 0.875em;
        }
    </style>
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h2 class="mb-0">Registration Form</h2>
            </div>
            <div class="card-body">
                <form id="registrationForm" action="/submit" method="POST">
                    <div class="mb-3">
                        <label for="username" class="form-label">Full Name</label>
                        <input type="text" class="form-control" id="username" name="username" required>
                        <div class="error-feedback">Please enter your full name</div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="email" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                        <div class="error-feedback">Please enter a valid email address</div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="age" class="form-label">Age</label>
                        <input type="number" class="form-control" id="age" name="age" min="1" max="150" required>
                        <div class="error-feedback">Please enter a valid age (1-150)</div>
                    </div>
                    
                    <div class="text-center">
                        <button type="submit" class="btn btn-primary">Register</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('registrationForm').addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validate username
            const username = document.getElementById('username');
            if (!username.value.trim()) {
                username.nextElementSibling.style.display = 'block';
                isValid = false;
            } else {
                username.nextElementSibling.style.display = 'none';
            }
            
            // Validate email
            const email = document.getElementById('email');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value)) {
                email.nextElementSibling.style.display = 'block';
                isValid = false;
            } else {
                email.nextElementSibling.style.display = 'none';
            }
            
            // Validate age
            const age = document.getElementById('age');
            if (!age.value || age.value < 1 || age.value > 150) {
                age.nextElementSibling.style.display = 'block';
                isValid = false;
            } else {
                age.nextElementSibling.style.display = 'none';
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    </script>
</body>
</html>
"""

@app.route("/", methods=["GET"])
def home():
    return render_template_string(form_html)

@app.route("/submit", methods=["POST"])
def submit():
    username = request.form.get("username", "")
    response_data = {"message": f"welcome, {username}! you are looking good today!"}
    if request.accept_mimetypes.accept_json and not request.accept_mimetypes.accept_html:
        return jsonify(response_data)
    
    success_html = """
    <!doctype html>
    <html>
    <head>
        <title>Registration Success</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
        <div class="container mt-5">
        <div class="card shadow-sm">
            <div class="card-header bg-success text-white">
            <h2 class="mb-0">Success!</h2>
            </div>
            <div class="card-body text-center">
            <h3 class="text-success mb-4">{{ message }}</h3>
            <a href="/" class="btn btn-primary">Back to Registration</a>
            </div>
        </div>
        </div>
    </body>
    </html>
    """
    return render_template_string(success_html, message=response_data["message"])

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=False)