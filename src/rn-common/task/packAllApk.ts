import * as sh from 'shelljs';




if (process.env.ENVTYPE == "test") {
    let args = process.argv;

    for (let i = 2; i < args.length; i++) {
        let project = args[i];
        sh.exec(`cd android && cross-env ENVFILE=.env.${project}.test ./gradlew assembleRelease`);
    }


} else {

    let args = process.argv;

    for (let i = 2; i < args.length; i++) {
        let project = args[i];
        sh.exec(`cd android && cross-env ENVFILE=.env.${project} ./gradlew assembleRelease`);
    }



}
