from flask import Flask, render_template, jsonify, request, session
import random
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)  # 세션을 위한 비밀키

@app.route('/')
def index():
    # 새로운 게임 시작 시 세션 초기화
    if 'high_score' not in session:
        session['high_score'] = float('inf')
    if 'answer' not in session:
        session['answer'] = random.randint(1, 100)
    if 'attempts' not in session:
        session['attempts'] = 0
    
    return render_template('index.html', high_score=session['high_score'])

@app.route('/check_guess', methods=['POST'])
def check_guess():
    try:
        guess = int(request.json['guess'])
        
        if guess < 1 or guess > 100:
            return jsonify({
                'status': 'error',
                'message': '알파카는 1마리에서 100마리 사이에요!'
            })
        
        session['attempts'] = session.get('attempts', 0) + 1
        
        if guess == session['answer']:
            # 정답을 맞췄을 때
            if session['attempts'] < session['high_score']:
                session['high_score'] = session['attempts']
            
            result = {
                'status': 'correct',
                'message': f'와! 정확해요! 알파카가 {session["answer"]}마리가 있었네요!\n{session["attempts"]}번 만에 찾으셨어요!',
                'attempts': session['attempts'],
                'high_score': session['high_score']
            }
            # 새 게임 시작
            session['answer'] = random.randint(1, 100)
            session['attempts'] = 0
            
        else:
            # 틀렸을 때
            hint = '더 많이' if guess < session['answer'] else '더 적게'
            result = {
                'status': 'wrong',
                'message': f'음... 알파카가 {guess}마리보다 {hint} 있어요! 🦙',
                'attempts': session['attempts']
            }
        
        return jsonify(result)
        
    except ValueError:
        return jsonify({
            'status': 'error',
            'message': '숫자를 입력해주세요!'
        })

@app.route('/new_game', methods=['POST'])
def new_game():
    session['answer'] = random.randint(1, 100)
    session['attempts'] = 0
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)
