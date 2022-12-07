#DATABASE LOGIC
import mysql.connector
from mysql.connector import errorcode
global user_name
import time
user_name = "YATM"
###CREATING ITEMS###
#creating the connection to the sql Database

def create_connection(db_name):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = mysql.connector.connect(user='root', password='CapStone_2023',
                                      host='127.0.0.1',
                                      database=db_name)
        return conn
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)

#Creating user Table
def create_table(conn, name):
    Table_string = """ CREATE TABLE {table} (
                                        username char(35) NOT NULL,
                                        password char(35) NOT NULL
                                    ); """
    try:
        cursor = conn.cursor()
        cursor.execute(Table_string.format(table=name))
        cursor.close()
    except mysql.connector.Error as err:
        print(err)

#Adding to a table
def addUser(conn, username, password):
    userInfo=(username,password)
    adduser=("INSERT INTO users"
            "(username, password)"
            "VALUES (%s,%s)")
    try:
        cursor=conn.cursor()
        cursor.execute(adduser,userInfo)
        conn.commit()
        cursor.close()
    except mysql.connector.Error as err:
        print(err)

def main():
    conn = create_connection("user_db")
    create_table(conn, "Test")
    #addUser(conn,"joseph", "joestar")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM USERS")
    result = cursor.fetchall()
    cursor.close()
    print(result)

if __name__ == "__main__":
    main()
