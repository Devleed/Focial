/************* SETUP *************/

( for node package manager )

1- after cloning or downloadin run following commands in the directory's terminal.
    - npm install
    - npm run client-install

2- create a config folder in the root directory, inside of that config folder create default.json file.

    root-directory
        -> config
            -> default.json

3- add this content in default.json file.

    {
        "mongoURI": < your mongodb connection string > ,
        "jwtSecret": < your jwt secret > ,
        "senderEmail": < your company's or product's or personal email >,
        "senderPassword": < your password for that email >
    }

4- after above steps run following command in terminal.
    - npm run dev