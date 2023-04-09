
module {
    
    public type InitArgs = {
        environment : Text;
        allowedUsers : ?[Principal];
        auth : [Principal];
        admins : [Principal];
        gameServers : [Principal];
    };

}