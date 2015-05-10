# -*- coding: utf-8 -*-
from __future__ import with_statement
from config import load_config #绝对导入
import MySQLdb

from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash, _app_ctx_stack,jsonify
import time
#初始化环境


app = Flask(__name__)
config = load_config()
app.config.from_object(config)
app.config.from_envvar('FLASKR_SETTINGS', silent=True)



def get_db():
    db = MySQLdb.connect(host=app.config['HOST'],
        user=app.config['USER'],
        passwd=app.config['PASSWD'],
        db=app.config['DB'],
        charset=app.config['CHARSET']
        )
    return db

@app.before_request
def before_request():
    g.db = get_db()

@app.teardown_appcontext
def close_db_connection(exception):
    """Closes the database again at the end of the request."""
    top = _app_ctx_stack.top
    if hasattr(top, 'sqlite_db'):
        top.sqlite_db.close()

@app.route('/')
def _index():
    return "I am jack"
###################################
@app.route('/announce_detail/<title>',methods=['GET','POST'])
def announce_detail(title):
    if session['username']:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('select title,author,date,text from announcement where title = %s',[title])
        details = cursor.fetchone()
        return render_template('announce_detail.html',details = details)
    return redirect(url_for('login'))

@app.route('/announce_lists',methods=['GET','POST'])
def announce_lists():
    if session['username']:
        db = get_db()  
        cursor = db.cursor()
        cursor.execute("select title,author,date from announcement order by date desc")
        datas = cursor.fetchall() 
        return render_template('announce_lists.html',head=u"公告",datas = datas)
    return redirect(url_for('login'))

@app.route('/personal_modify/<username>',methods=['GET','POST'])
def personal_modify(username):
    if session.get('username'):
        password = request.form['password']
        NickName = request.form['NickName']
        db = get_db()
        cursor = db.cursor()
        cursor.execute("update user set password = %s,nickname = %s where no = %s",[password,NickName,username])
        db.commit()
        flash(u"Modify Successfully!")
        return redirect(url_for('personal_info',username=username))
    return redirect(url_for('login'))

@app.route('/personal_info/<username>',methods=['POST','GET'])
def personal_info(username):
    if session.get("username"):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("select * from user where no = %s",[username])
        info = cursor.fetchone()
        return render_template('personal_info.html',info = info,head=u"个人设置")
    
    return redirect(url_for('login'))    

@app.route('/show_lists/<depart>',methods=['GET','POST'])
def show_lists(depart):
    if session.get("username"):
            session['depart'] = depart
            db = get_db()
            cur = db.cursor()
            cur.execute('select major,name,sex,depart,status,average from communists where depart = %s',[depart])
            lists = cur.fetchall()
            return render_template('show_lists.html', lists=lists,head  = depart)
    return redirect(url_for('login'))

@app.route('/add_comments/<cname>', methods=['POST','GET'])
def add_comments(cname):
    if not session['username']:
        return render_template('login.html',error = "Please Log in!")
    if (int(request.form.get('score'))) > 100 or (int(request.form.get('score')))<0:
        return render_template('show_comments.html',cname =cname, error = u'请在0~100之间输入！')
    mytime = time.strftime("%Y-%m-%d %H:%M:%S")
    db = get_db()
    cursor = db.cursor()
    cursor.execute("select nickname from user where no = %s",[session['username']])
    nickname = cursor.fetchone()[0]
    cursor.execute('insert into comments (name,nickname,cname,score,date,text) values (%s, %s, %s, %s, %s, %s)',
                [ session['username'], nickname,cname,request.form.get('score'), mytime, request.form.get('text') ])
    cursor.execute('update communists set score=score + %s,count = count +1 where name = %s',
               [request.form.get('score'),  cname  ])
    db.commit()
    cursor.execute('update communists set average = score / count where name = %s',[ cname ])
    db.commit()
    
    return redirect(url_for('show_comments',cname= cname ))

@app.route('/show_comments/<cname>')
def show_comments(cname):
    if session['username'] :
        db = get_db()
        cursor = db.cursor()
        cursor.execute('select nickname,score,date,text from comments where cname = %s',[cname])
        comments = cursor.fetchall()
        return render_template('show_comments.html',cname = cname,comments = comments,head = u'党员评价')
    return render_template('login.html',error='Please LOG IN!')
#####################################################


@app.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':
            username = request.args.get('username')
            password = request.args.get('password')
            db = get_db()
            cur = db.cursor()
            cur.execute('select password from user where username =%s',[username])
            user = cur.fetchone()

            if  (user) and (password == str(user[0])):
                session["username"] = username
                cur.execute('update user set OnLine = 1 where username = %s',[username])
                db.commit()
                return "1"
            
    return "0"
@app.route('/register', methods=['GET', 'POST'])
def register():

    if request.method == 'POST':
            username = request.args.get('username')
            password = request.args.get('password')
            db = get_db()
            cur = db.cursor()
            cur.execute('select password from user where username =%s',[username])
            user = cur.fetchone()

            if  user:
                return "2" #用户已经被注册！
            else :
                cur.execute('insert into user(username,password) values(%s,%s)',[username,password])
                cur.execute('insert into friends(HostUsername,FriendUsername) values(%s,%s)',[username,username])
                db.commit()
                return "1"
            
    return "0"

@app.route("/pwd_modify",methods=['GET','POST'])
def pwd_modify():
    if request.method == 'POST':
        username = request.args.get('username')
        newpwd   = request.args.get('newpwd')
        db = get_db()
        cur = db.cursor()
        cur.execute('update user set password =%s where username= %s',[newpwd,username])
        db.commit()
        return "1"
    else :
        return "0"

@app.route('/act_publish',methods=['POST','GET'])
def act_publish():
    act_name = request.args.get('act_name')
    publisher = request.args.get('publisher')
    details = request.args.get('details')
    location = request.args.get('location')
    act_time = request.args.get('act_time')
    pub_time = time.strftime("%Y-%m-%d %H:%M:%S")
    act_type = request.args.get('type')
    db = get_db()
    cursor = db.cursor()
    cursor.execute('insert into activity(act_name,publisher,details,location,act_time,pub_time,type) \
        values (%s,%s,%s,%s,%s,%s,%s)',
        [act_name,publisher,details,location,act_time,pub_time,act_type])
    db.commit()
    return "1"

@app.route('/logout',methods=['POST','GET'])
def logout():
    session['username']=None
    username = request.args.get('username')
    db = get_db()
    cur = db.cursor()
    cur.execute('update user set OnLine = 0 where username = %s',[username])
    db.commit()
    return "1"

@app.route('/get_act_list/<username>')
def get_act_list(username):

    testData = {"array":[]}
    db = get_db()
    cursor = db.cursor()
    if username != "all":
        cursor.execute('select FriendUsername from friends where HostUsername=%s',[username])
        users = cursor.fetchall()
        
        for x in users:
            cursor.execute("select * from activity  where publisher =%s order by pub_time desc",[x[0]])
            data = cursor.fetchall()
            for i in data:
                item = {}
                item["id"]        = i[0]
                item["act_name"]  = i[1]
                item["publisher"] = i[2]
                item["details"]   = i[3]
                item["location"]  = i[4]
                item["act_time"]  = str(i[5])
                item["pub_time"]  = str(i[6])
                item["type"]      = i[7]
                testData["array"].append(item)

        return jsonify(testData)
    
    
    cursor.execute('select * from activity order by pub_time desc')
    data = cursor.fetchall()
    
    
    for i in data:
        item = {}
        item["id"]       = i[0]
        item["act_name"] = i[1]
        item["publisher"] = i[2]
        item["details"]  = i[3]
        item["location"] = i[4]
        item["act_time"] = str(i[5])
        item["pub_time"] = str(i[6])
        item["type"]     = i[7]
        testData["array"].append(item)


    return jsonify(testData)

@app.route("/get_act/<act_id>")
def get_act(act_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("select * from activity where Id = %s",[act_id])
    data = cursor.fetchall()
    item = {}
    for i in data:

        item["id"]       = i[0]
        item["act_name"] = i[1]
        item["publisher"] = i[2]
        item["details"]  = i[3]
        item["location"] = i[4]
        item["act_time"] = str(i[5])
        item["pub_time"] = str(i[6])
        item["type"]     = i[7]
    return jsonify(item)

@app.route('/get_comment/<act_id>')
def get_comment(act_id):

    testData = {"array":[]}
    db = get_db()
    cursor = db.cursor()
    cursor.execute('select * from comments where act_id=%s order by time',[act_id])
    data = cursor.fetchall()
        
    
    for i in data:
        item = {}
        item["id"]        = i[0]
        item["act_id"]    = i[1]
        item["username"]  = i[2]
        item["comments"]  = i[3]
        item["time"]      = i[4]

        testData["array"].append(item)

    return jsonify(testData)

@app.route('/set_comment',methods=['GET','POST'])
def set_comment():

    act_id   = request.args.get("act_id")
    username = request.args.get("username")
    comments = request.args.get("comments")

    mytime = time.strftime("%Y-%m-%d %H:%M:%S")
    db = get_db()
    cursor = db.cursor()
    cursor.execute('insert into comments(act_id,username,comments,time) values(%s,%s,%s,%s)',[act_id,username,comments,mytime])
    db.commit()
    
    return "1"

if __name__ == '__main__':
    app.debug = True
    app.run('0.0.0.0',9000)
