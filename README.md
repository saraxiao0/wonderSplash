Based on https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world

Steps:

* Generate a github personal access token! This lets you use Github commands from the command line/terminal.
* From your GitHub account, go to Settings → Developer Settings → Personal Access Token → Tokens (classic) → Generate New Token (Give your password) → Fillup the form → click Generate token → Copy the generated Token, it will be something like ghp_sFhFsSHhTzMDreGRLjmks4Tzuzgthdvfsrta
   * when filling up the form you can just check yes to every single permission, it's fine.
* SAVE THIS TOKEN SOMEWHERE. It is equivalent to your password. 

----

EITHER:

* Click the green Code button
* copy the url in the HTTP section
* go to terminal, type in `git clone (paste url with ctrl v shift)`

OR:

* go to terminal, type in `git clone https://github.com/saraxiao0/wonderSplash.git`

--

* you may be prompted to enter your username + password in the terminal. enter your username but instead of your normal github password enter your personal access token.

----

in terminal:
* run `python3 -m venv wonderSplashVenv` - this creates a new virtual environment called wonderSplashVenv in your folder. a virtual environment is basically a separate version of Python that isn't the default version that comes with your computer. it's a good idea to make a new virtual environment for every big Python project you do, so if you have a lot of different modules for different python projects, they don't conflict with each other version-wise.
    * if that doesn't work, try just `python` instead of `python3`
* run `source wonderSplashVenv/bin/activate` - this activates the wonderSplashVenv virtual environment, so it will now be the version of Python you're using.
    * for windows, use: '.\wonderSplashVenv\Scripts\activate'
    * (you can type `source deactivate` to disable it and go back to your system/default version of Python. you don't need to do this though. new terminals will start without it.)
* run `pip install -r requirements.txt` - this installs all the Python modules you'll need into the wonderSplashVenv virtual environment you made. it does this by looking at requirements.txt which is a list of modules.

* run `flask run`
  * this won't work without `source wonderSplashVenv/bin/activate`
  * something will pop up that looks like `Running on http://127.0.0.1:5000`
  * go to your browser and enter that url e.g. http://127.0.0.1:5000
  * the app should show up
* if on a Mac (OSX), use `flask run --host=0.0.0.0`
  * then instead of `http://127.0.0.1:5000`, use the url `http://0.0.0.0:5000`

----

to save your changes, in terminal or git bash or whatever:

* run `git add .` --- this will add all the changes you've made to the next commit you make
* run `git commit -m "[tile of commit, short message describing what it does]"` --- this will bundle all your added changes into a commit.
  * you can use `git log` (`q` to quit) to see all the commits everyone has made to the project. you should see your commit as the most recent one
* run `git push` --- this will upload all the changes you've made to the Github version of the project
  * you may need to run `git pull` first, which downloads all the changes from the Github version of the project, before you push
    * you may need to add/commit your changes before you pull, or you'll get a warning about how they'll be overridden

you can also use the git or vscode gui but I'm not super familiar with them :\

---