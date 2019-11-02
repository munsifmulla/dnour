# dnour
dnour 

Steps to install Project
1. Install node JS on the system.
  1.1. Download Node JS --> https://nodejs.org/en/download/
  1.2. Aftet the Installation is done, verify if `node` and `npm` is installed
       1.2.1. Open the Command Promp
       1.2.2. Run the command `node -v` in cmd, if the output is vxx.xx. installation is successfull.
       1.2.3. Run the command `npm -v` in cmd, if the output is npm vxx.xx. npm is installed.

2. Install Git on Computer
	2.1. Download and install --> https://git-scm.com/download/win
	2.2. Youtube link for reference ---> https://www.youtube.com/watch?v=albr1o7Z1nw

3. Create a folder called `ipcs` in Desktop. and Open the created folder using cmd line, Use this to learn how to use cmd ---> https://www.digitalcitizen.life/command-prompt-how-use-basic-commands

4. Pull the project from GitHub
    4.1. Once you are in the `ipcs` folder use this comand to get the project into your computer ---> `git clone https://github.com/munsifmulla/dnour.git`

5. Once the priject is cloned, use command `cd dnour` to get into the project folder.

6. After you get the project Install the dependencies for the project.
	6.1. Run command `npm i --save-dev --unsafe-perm` to install the project

7. Type command `mongo` in cmd and hit enter
	7.1. Type `use dnour` in cmd and hit enter
	7.2. Type `exit` in cmd and hit enter

8. Make sure you are in the project folder `dnour` and run following command to import db.
	8.1. `mongoimport --db dnour --file /db/users.json`

9. Once all above steps are done, Now run the project
	9.1. Type `npm start` in command.
	9.2. Open `http://localhost:3300/dashboard/login` in browser