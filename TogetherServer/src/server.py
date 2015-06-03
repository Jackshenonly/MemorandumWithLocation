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
#####################################################

#1
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
#2
@app.route('/register', methods=['GET', 'POST'])
def register():

    if request.method == 'POST':
            username = request.args.get('username')
            password = request.args.get('password')
            username = username[:20]
            password = password[:20]
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
#3
@app.route("/pwd_modify",methods=['GET','POST'])
def pwd_modify():
    if request.method == 'POST':
        username = request.args.get('username')
        newpwd   = request.args.get('newpwd')
        newpwd  = newpwd[:20]
        db = get_db()
        cur = db.cursor()
        cur.execute('update user set password =%s where username= %s',[newpwd,username])
        db.commit()
        return "1"
    else :
        return "0"

#4
@app.route("/updateNickName",methods=['GET','POST'])
def updateNickName():
    if request.method == 'POST':
        username = request.args.get('username')
        NickName   = request.args.get('NickName')
        NickName = NickName[:20]
        db = get_db()
        cur = db.cursor()
        cur.execute('update user set NickName =%s where username= %s',[NickName,username])
        db.commit()
        return "1"
    else :
        return "0"
#5
@app.route("/updateGender",methods=['GET','POST'])
def updateGender():
    if request.method == 'POST':
        username = request.args.get('username')
        Gender   = request.args.get('Gender')
        db = get_db()
        cur = db.cursor()
        cur.execute('update user set Gender =%s where username= %s',[Gender,username])
        db.commit()
        return "1"
    else :
        return "0"
#6
@app.route("/getNickName/<username>",methods=['GET','POST'])
def getNickName(username):


        db = get_db()
        cur = db.cursor()
        cur.execute('select NickName,Gender from user where username= %s',[username])
        data =cur.fetchall()
        test = {}
        for x in data:
            test["nickname"] =x[0]
            test["gender"] = x[1] 
        return jsonify(test)

#7
@app.route('/act_publish',methods=['POST','GET'])
def act_publish():
    act_name = request.args.get('act_name')
    publisher = request.args.get('publisher')
    details = request.args.get('details')
    location = request.args.get('location')
    act_time = request.args.get('act_time')
    lat = request.args.get('lat').replace(".","")[:8]
    lon = request.args.get('lon').replace(".","")[:9]
    pub_time = time.strftime("%Y-%m-%d %H:%M:%S")
    act_type = request.args.get('type')
    db = get_db()
    cursor = db.cursor()
    cursor.execute('insert into activity(act_name,publisher,details,location,act_time,pub_time,type,lat,lon) \
        values (%s,%s,%s,%s,%s,%s,%s,%s,%s)',
        [act_name,publisher,details,location,act_time,pub_time,act_type,lat,lon])
    db.commit()
    return "1"
#8
@app.route('/logout',methods=['POST','GET'])
def logout():
    session['username']=None
    username = request.args.get('username')
    db = get_db()
    cur = db.cursor()
    cur.execute('update user set OnLine = 0 where username = %s',[username])
    db.commit()
    return "1"
#9
@app.route('/get_act_list')
def get_act_list():

    username = request.args.get('username')


    testData = {"array":[]}
    mine = ["all00","all01","all10","all11"]
    db = get_db()
    cursor = db.cursor()
    if username not in mine:
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

    loc = username[3:4]
    hot = username[4:5]

    lat = int(request.args.get('lat').replace(".","")[:8])
    lon = int(request.args.get('lon').replace(".","")[:9])
    sql1 = "((lat-"+str(lat)+")*" + "(lat-"+str(lat)+")+"
    sql2 = "(lat-"+str(lat)+")*" + "(lat-"+str(lat)+")) as b"
    print sql1,sql2 

    if loc=='0':
        if hot=='0':
            cursor.execute('select * from activity order by pub_time desc')
        else:
            cursor.execute('select * from activity order by mlike desc,pub_time desc')
    else:
        if hot=='0':
            cursor.execute('select *,'+sql1+sql2+' from activity order by b,pub_time desc')
        else:
            cursor.execute('select *,'+sql1+sql2+' from activity order by b,mlike desc,pub_time desc')
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


#10
@app.route('/get_act_list_halfFriend/<username>')
def get_act_list_halfFriend(username):

    testData = {"array":[]}
    db = get_db()
    cursor = db.cursor()
    cursor.execute('select FriendUsername from friends where HostUsername=%s',[username])
    data1 = cursor.fetchall()
   # mstr = ""
   # ostr = ""
    for x in data1:
        #mstr +=x[0] + "\t"
        cursor.execute('select FriendUsername from friends where HostUsername=%s',[x[0]])
        data2 = cursor.fetchall()
        for  y in data2:
            
            if y not in data1:
                # ostr +=y[0] + "\t"
                cursor.execute('select * from activity where publisher=%s',[y[0]])
                data3 = cursor.fetchall()
                for i in data3:
                        item = {}
                        item["id"]       = i[0]
                        item["act_name"] = i[1]
                        item["publisher"] = i[2]
                        item["details"]  = i[3]
                        item["location"] = i[4]
                        item["act_time"] = str(i[5])
                        item["pub_time"] = str(i[6])
                        item["type"]     = i[7]
                        item["commonFriend"] = x
                        testData["array"].append(item)
    # return mstr +"HHHHHH    "+ostr


    return jsonify(testData)


#11
@app.route("/get_act")
def get_act():
    act_id = request.args.get('act_id')
    username = request.args.get('username')
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
        item["like"] = str(i[8])
        item["dislike"] = str(i[9])

    cursor.execute('select count(*) from collect where act_id=%s and collecter = %s',[act_id,username])
    flag = cursor.fetchone()
    item["collect"] = flag[0]

    item["array"] = []
    cursor.execute('select participater from participate where act_id=%s and reject = \'0\'',[act_id])
    data = cursor.fetchall()
    for x in data:
        item["array"].append(x[0])

    return jsonify(item)
#12
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
#13
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
#14
@app.route("/add_friend",methods = ['POST','GET'])
def add_friend():
    HostUsername = request.args.get("HostUsername")
    FriendUsername = request.args.get("FriendUsername")
    db = get_db()
    cursor = db.cursor()
    cursor.execute("select * from friends where HostUsername=%s and FriendUsername = %s",[HostUsername,FriendUsername])
    data1 = cursor.fetchall()
    cursor.execute("select * from user where username = %s",[FriendUsername])
    data2 = cursor.fetchall()
    if data1 :
        return "2"
    elif not data2 :
        return "3"
    else:
        cursor.execute("insert into friends(HostUsername,FriendUsername) values(%s,%s)",[HostUsername,FriendUsername])
        db.commit()

        return "1"
#15
@app.route("/haveAtry/<username>")
def haveAtry(username):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('select FriendUsername from friends where HostUsername=%s',[username])
    data1 = cursor.fetchall()
   # mstr = ""
    ostr = ""
    for x in data1:
        #mstr +=x[0] + "\t"
        cursor.execute('select FriendUsername from friends where HostUsername=%s',[x[0]])
        data2 = cursor.fetchall()
        for  y in data2:
            
            if y not in data1:
                 ostr +=y[0] +u"    共同好友："+x[0] +"\n"
    return ostr
#16
@app.route("/get_friend/<HostUsername>")
def get_friend(HostUsername):

    testData = {"array":[]}
    db = get_db()
    cursor = db.cursor()

    cursor.execute('select FriendUsername from friends where HostUsername=%s',[HostUsername])
    users = cursor.fetchall()
        
    for x in users:
        item = {}
        item["name"] = x[0]
        testData["array"].append(item)

    return jsonify(testData)

#17
@app.route('/getChatList/<username>')
def getChatList(username):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("select distinct FromUserID from messages where ToUserId=%s and MessageTypeid=1",[username])
    data = cursor.fetchall()
    testData = {"array":[]}
    for x in data :
        testData["array"].append(x[0])

    return jsonify(testData)

#18
@app.route('/getChatdata')
def getChatdata():
    toUserid = request.args.get("toUserid")
    fromUserid = request.args.get("fromUserid")
    db = get_db()
    cursor = db.cursor()
    cursor.execute("select *  from messages where ToUserId=%s and FromUserID=%s or ToUserId=%s and FromUserID=%s order by MessageTime",[toUserid,fromUserid,fromUserid,toUserid])
    data = cursor.fetchall()
    testData = {"array":[]}
    for x in data :
        item = {}
        item["id"] = x[0]
        item["FromUserID"] = x[1]
        item["ToUserId"] = x[2]
        item["Message"] = x[3]
        item["MessageTypeid"] = x[4]
        item["MessageStatus"] = x[5]
        item["MessageTime"] = x[6]
        item["me"] = toUserid

        testData["array"].append(item)

    return jsonify(testData)

#19
@app.route('/sendMessage',methods=["POST","GET"])
def sendMessage():
    if request.method == "GET":
        return "0"
    else :
        toUserid = request.args.get("toUserid")
        fromUserid = request.args.get("fromUserid")
        sendMessage = request.args.get("sendMessage")
        mtime = time.strftime("%Y-%m-%d %H:%M:%S")
        db = get_db()
        cursor = db.cursor()
        cursor.execute("insert into messages(FromUserId,ToUserId,Message,MessageTime) values(%s,%s,%s,%s)",[fromUserid,toUserid,sendMessage,mtime])
        db.commit()
        print "yes"
        return "1"
#20
@app.route('/getPersonalData/<username>')
def getPersonalData(username):
    s = {}
    db = get_db()
    cursor = db.cursor()
    cursor.execute('select NickName,Gender,Credit from user where username=%s',[username])
    data = cursor.fetchall()
    
    s['NickName'] = data[0][0]
    s['Gender']=data[0][1]
    s['Credit'] = data[0][2]
    
    s['myActivity'] = {}
    cursor.execute('select count(*) from activity where publisher=%s',[username])
    s['myActivity']['count'] = str(cursor.fetchone()[0])
    s['myActivity']['array'] = []

    cursor.execute('select * from activity  where publisher=%s order by pub_time desc',[username])
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
        s['myActivity']['array'].append(item)

    s['myCollect'] = {}
    cursor.execute('select count(*) from collect where collecter=%s',[username])
    s['myCollect']['count'] = str(cursor.fetchone()[0])
    s['myCollect']['array'] = []
    cursor.execute('select b.* from collect  as a INNER JOIN activity as b on a.collecter = %s and a.act_id = b.Id',[username])
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
        s['myCollect']['array'].append(item)


    s['myParticipate'] = {}
    cursor.execute("select count(*) from participate where participater=%s and reject = '0' ",[username])
    s['myParticipate']['count'] = str(cursor.fetchone()[0])
    s['myParticipate']['array'] = []
    cursor.execute("select b.* from participate  as a INNER JOIN activity as b on a.participater = %s and a.act_id = b.Id and a.reject = '0' ",[username])
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
        s['myParticipate']['array'].append(item)

    return jsonify(s)

#21
@app.route('/delete_act/<act_id>',methods=['POST','GET'])
def delete_act(act_id):

    if request.method =='POST':
        db = get_db()
        cursor = db.cursor()
        cursor.execute('delete from activity where id = %s',[act_id])
        db.commit()
        return '1'

    else:
        return '0'
#22
@app.route('/LikeOrDislike/<mod>',methods=['POST','GET'])
def LikeOrDislike(mod):
    if request.method =='POST':

        flag = mod[0]
        act_id = mod[1:]
        db = get_db()
        cursor = db.cursor()
        if(flag=='T'):
            cursor.execute('update activity set mlike=mlike +1 where id = '+act_id)
        if(flag=='F'):
            cursor.execute('update activity set mdislike=mdislike +1 where id = '+act_id)    
        db.commit()

        return "1"

    else:
        return "0"


@app.route('/act_collect',methods = ['POST','GET'])
def act_collect():
    act_id = request.args.get('act_id')
    username = request.args.get('username')
    db = get_db()
    cursor = db.cursor()
    cursor.execute('select count(*) from collect where act_id=%s and collecter = %s',[act_id,username])
    flag = cursor.fetchone()
    if flag[0] == 1:
        cursor.execute('delete from collect where act_id=%s and collecter = %s',[act_id,username])
        db.commit()
        return "1"
    if flag[0] == 0:
        cursor.execute('insert into collect(act_id,collecter) values(%s,%s)',[act_id,username])
        db.commit()
        return "1"
    return "0"

@app.route('/participate',methods=['POST','GET'])
def participate():
    act_id = request.args.get('act_id')
    username = request.args.get('username')
    db = get_db()
    cursor = db.cursor()
    cursor.execute("select count(*),reject from participate where act_id =%s and participater=%s",[act_id,username])
    data = cursor.fetchone()
    if data[0]== 0:
        cursor.execute('insert into participate(act_id,participater) values(%s,%s)',[act_id,username])
        db.commit()
        return '1'       
    elif data[0] == 1 and data[1] == '0' :
        return '2'
    elif data[0] == 1 and data[1] == '1' :
        return '3'

    return 'ERROR'


@app.route('/reject',methods=['POST','GET'])
def reject():
    username = request.args.get('username')
    act_id = request.args.get('act_id')
    db = get_db()
    cursor = db.cursor()
    cursor.execute("update participate set reject = '1' where act_id = %s and participater = %s",[act_id,username])
    db.commit()
    return "1"


if __name__ == '__main__':
    app.debug = True
    app.run('0.0.0.0',9000)
