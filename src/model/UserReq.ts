export class UserReq {
    constructor(
        public username: string = "",
        public password: string = "",
        public user_type: string = "client",
        public grant_type: string = 'password',
        public refresh_token: boolean = false,
        // public source: string = "",
        // public iphoneID: string = '',
    ) {

    }

}