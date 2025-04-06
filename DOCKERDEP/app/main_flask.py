from flask import Flask, render_template

# Nom de l'application
app = Flask(__name__)

# Définitipn de la route 

@app.route('/')
def index() :
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 1111) 