

/**
 * 登录后用户信息
 */
export class UserInfo {

    puiId = "";

    puiUuid = "";

    username = "";

    password = "";

    email = "";

    name = "";

    phone = "";

    gender = 0;

    birthday = "";

    avatar = "";

    avatarThumbnail = "";

    identifyPhotos = "";

    identifyPhotosThumbnail = "";

    userStatus = "";

    lastLoginIp = "";

    lastLoginTime = "";

    token = "";


    isLogin() {
        return this.token && this.puiUuid
    }


    getUserId() {
        return this.puiUuid
    }

}
