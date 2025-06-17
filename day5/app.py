from flask import Flask, request, jsonify, render_template_string
from flask_restx import Api, Resource, fields
from flask_cors import CORS
from faker import Faker
from prometheus_client import Counter, generate_latest
import prometheus_client
import random
from datetime import datetime, timedelta

# Initialize Flask and extensions
app = Flask(__name__)
app.url_map.strict_slashes = False
requests_total = Counter('requests_total', 'Total requests')
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://friendly-space-zebra-r4pr7j4pq5jqhxj47-3000.app.github.dev",
            "https://friendly-space-zebra-r4pr7j4pq5jqhxj47-8001.app.github.dev"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "supports_credentials": False,
        "expose_headers": ["Content-Type", "Authorization"],
        "max_age": 600
    }
})
fake = Faker()

# Initialize Flask-RESTX
api = Api(
    app,
    version='1.0',
    title='E-Commerce API',
    description='A fake e-commerce API with sample data',
    doc='/swagger/'  # Note the trailing slash
)

@app.route('/metrics')
def metrics():
    return generate_latest()
# Add default route
# Add namespaces for API organization
ns_products = api.namespace('products', description='Product operations')
ns_categories = api.namespace('categories', description='Category operations')
ns_users = api.namespace('users', description='User operations')

# Define models for Swagger documentation
product_model = api.model('Product', {
    'id': fields.String(required=True, description='Product unique identifier'),
    'name': fields.String(required=True, description='Product name'),
    'description': fields.String(required=True, description='Product description'),
    'price': fields.Float(required=True, description='Product price'),
    'category': fields.String(required=True, description='Product category'),
    'image_url': fields.String(required=True, description='Product image URL'),
    'rating': fields.Float(required=True, description='Product rating'),
    'stock': fields.Integer(required=True, description='Product stock quantity'),
    'created_at': fields.DateTime(required=True, description='Creation date')
})

review_model = api.model('Review', {
    'id': fields.String(required=True, description='Review unique identifier'),
    'user_name': fields.String(required=True, description='Reviewer name'),
    'rating': fields.Integer(required=True, description='Review rating'),
    'comment': fields.String(required=True, description='Review comment'),
    'created_at': fields.DateTime(required=True, description='Review date')
})


# Helper functions
def generate_product():
    categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty']
    return {
        "id": fake.uuid4(),
        "name": fake.catch_phrase(),
        "description": fake.text(max_nb_chars=200),
        "price": round(random.uniform(9.99, 999.99), 2),
        "category": random.choice(categories),
        "image_url": f"https://picsum.photos/seed/{random.randint(1, 1000)}/400/300",
        "rating": round(random.uniform(3.5, 5.0), 1),
        "stock": random.randint(0, 100),
        "created_at": (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat()
    }

def generate_review():
    return {
        "id": fake.uuid4(),
        "user_name": fake.name(),
        "rating": random.randint(1, 5),
        "comment": fake.paragraph(),
        "created_at": fake.date_time_this_year().isoformat()
    }

# API Routes
@ns_products.route('/')
class ProductList(Resource):
    @api.doc(params={'count': 'Number of products to return'})
    @api.marshal_list_with(product_model)
    def get(self):
        """Get a list of products"""
        count = int(request.args.get('count', 10))
        return [generate_product() for _ in range(count)]

@ns_products.route('/<product_id>')
class Product(Resource):
    @api.marshal_with(product_model)
    def get(self, product_id):
        """Get a specific product by ID"""
        product = generate_product()
        product["id"] = product_id
        product["reviews"] = [generate_review() for _ in range(random.randint(3, 10))]
        return product

@ns_categories.route('/')
class Categories(Resource):
    def get(self):
        """Get all product categories"""
        categories = [
            {
                "id": fake.uuid4(),
                "name": category,
                "description": fake.text(max_nb_chars=100),
                "product_count": random.randint(10, 100)
            }
            for category in ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty']
        ]
        return categories

@ns_users.route('/current')
class CurrentUser(Resource):
    def get(self):
        """Get current user profile"""
        return {
            "id": fake.uuid4(),
            "name": fake.name(),
            "email": fake.email(),
            "avatar": f"https://i.pravatar.cc/150?u={fake.uuid4()}",
            "address": {
                "street": fake.street_address(),
                "city": fake.city(),
                "state": fake.state(),
                "zip_code": fake.zipcode()
            },
            "orders": [
                {
                    "id": fake.uuid4(),
                    "date": fake.date_time_this_year().isoformat(),
                    "total": round(random.uniform(20, 500), 2),
                    "status": random.choice(["pending", "shipped", "delivered"])
                } for _ in range(random.randint(2, 5))
            ]
        }

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "swagger_url": "/swagger/"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001, debug=True)