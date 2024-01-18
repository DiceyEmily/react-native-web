

export function initMock() {


    //development
    if (process.env.NODE_ENV !== "development") {
        return;
    }



    // Mock.mock(url.login, () => {
    //     let u = new UserInfo();
    //     u.userName = rand.cname();
    //     // u.loginName = rand.cname();
    //     u.userGUID = "{11111111111}";
    //     u.token = "sssssss";
    //     return u;
    // })


}