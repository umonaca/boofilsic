
$(document).ready( function() {
    
    let token = $("#oauth2Token").text();
    let mast_uri = $("#mastodonURI").text();
    let mast_domain = new URL(mast_uri);
    mast_domain = mast_domain.hostname;
    let id = $("#userMastodonID").text();

    let userInfoSpinner = $("#spinner").clone().removeAttr("hidden");
    let followersSpinner = $("#spinner").clone().removeAttr("hidden");
    let followingSpinner = $("#spinner").clone().removeAttr("hidden");
    $("#userInfoCard").append(userInfoSpinner);
    $("#followings h5").after(followingSpinner);
    $("#followers h5").after(followersSpinner);
    $(".mast-following-more").hide();
    $(".mast-followers-more").hide();

    getUserInfo(
        id, 
        mast_uri, 
        token, 
        function(userData) {
            let userName;
            if (userData.display_name) {
                userName = translateEmojis(userData.display_name, userData.emojis, true);
            } else {
                userName = userData.username;
            }
            $("#userInfoCard .mast-avatar").attr("src", userData.avatar);
            $("#userInfoCard .mast-displayname").html(userName);
            $("#userInfoCard .mast-brief").text($(userData.note).text());
            $(userInfoSpinner).remove();
        }
    );

    getFollowers(
        id,
        mast_uri,
        token,
        function(userList, request) {
            if (userList.length == 0) {
                $(".mast-followers").hide();
                $(".mast-followers").before('<div style="margin-bottom: 20px;">暂无</div>');

            } else {
                if (userList.length > 4){
                    userList = userList.slice(0, 4);
                    $(".mast-followers-more").show();
                }
                let template = $(".mast-followers li").clone();
                $(".mast-followers").html("");
                userList.forEach(data => {
                    temp = $(template).clone();
                    temp.find("img").attr("src", data.avatar);
                    if (data.display_name) {
                        temp.find(".mast-displayname").html(translateEmojis(data.display_name, data.emojis));
                    } else {
                        temp.find(".mast-displayname").text(data.username);
                    }
                    let url;
                    if (data.acct.includes('@')) {
                        url = $("#userPageURL").text().replace('0', data.acct);
                    } else {
                        url = $("#userPageURL").text().replace('0', data.acct + '@' + mast_domain);
                    }
                    temp.find("a").attr('href', url);
                    $(".mast-followers").append(temp);
                });
            }
            $(followersSpinner).remove();
        }
    );

    getFollowing(
        id,
        mast_uri,
        token,
        function(userList, request) {
            if (userList.length == 0) {
                $(".mast-following").hide();
                $(".mast-following").before('<div style="margin-bottom: 20px;">暂无</div>');
            } else {
                if (userList.length > 4){
                    userList = userList.slice(0, 4);
                    $(".mast-following-more").show();
                }
                let template = $(".mast-following li").clone();
                $(".mast-following").html("");
                userList.forEach(data => {
                    temp = $(template).clone()
                    temp.find("img").attr("src", data.avatar);
                    if (data.display_name) {
                        temp.find(".mast-displayname").html(translateEmojis(data.display_name, data.emojis));
                    } else {
                        temp.find(".mast-displayname").text(data.username);
                    }
                    let url;
                    if (data.acct.includes('@')) {
                        url = $("#userPageURL").text().replace('0', data.acct);
                    } else {
                        url = $("#userPageURL").text().replace('0', data.acct + '@' + mast_domain);
                    }
                    temp.find("a").attr('href', url);
                    $(".mast-following").append(temp);
                });
            }
            $(followingSpinner).remove();

        }
    );
    
});