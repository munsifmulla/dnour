# dnour
dnour 

Steps to install Project
1. Install node JS on the system.
  1.1. Download Node JS --> https://nodejs.org/en/download/ <br />
  1.2. Aftet the Installation is done, verify if `node` and `npm` is installed <br />
       1.2.1. Open the Command Promp <br />
       1.2.2. Run the command `node -v` in cmd, if the output is vxx.xx. installation is successfull. <br />
       1.2.3. Run the command `npm -v` in cmd, if the output is npm vxx.xx. npm is installed. <br />

2. Install Git on Computer <br />
	2.1. Download and install --> https://git-scm.com/download/win <br />
	2.2. Youtube link for reference ---> https://www.youtube.com/watch?v=albr1o7Z1nw <br />

3. Create a folder called `ipcs` in Desktop. and Open the created folder using cmd line, Use this to learn how to use cmd ---> https://www.digitalcitizen.life/command-prompt-how-use-basic-commands <br />

4. Pull the project from GitHub <br />
    4.1. Once you are in the `ipcs` folder use this comand to get the project into your computer ---> `git clone https://github.com/munsifmulla/dnour.git` <br />

5. Once the priject is cloned, use command `cd dnour` to get into the project folder. <br />

6. After you get the project Install the dependencies for the project. <br />
	6.1. Run command `npm i --save-dev --unsafe-perm` to install the project <br />

7. Type command `mongo` in cmd and hit enter <br />
	7.1. Type `use dnour` in cmd and hit enter <br />
	7.2. Type `exit` in cmd and hit enter <br />

8. Make sure you are in the project folder `dnour` and run following command to import db. <br />
	8.1. `mongoimport --db dnour --file /db/users.json` <br />

9. Once all above steps are done, Now run the project <br />
	9.1. Type `npm start` in command. <br />
	9.2. Open `http://localhost:3300/dashboard/login` in browser <br />