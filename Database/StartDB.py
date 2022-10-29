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
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
    return conn

#Creating user Table
def create_userdata_table(conn):
    Table_string = """ CREATE TABLE USERS (
                                        username char(35) NOT NULL,
                                        password char(35) NOT NULL
                                    ); """
    try:
        cursor = conn.cursor()
        cursor.execute(Table_string)
    except Error as e:
        print(e)

def main():
    conn = create_connection("user_db")
    create_userdata_table(conn)

if __name__ == "__main__":
    main()
