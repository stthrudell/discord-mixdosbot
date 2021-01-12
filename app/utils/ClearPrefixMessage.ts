class ClearPrefixMessage {
    static clear(message: string, prefix: string = "!") {
        message = message.replace(prefix, "");
        const messageSplited = message.split(" ");
        const command = messageSplited[0];
        const args = messageSplited.slice(1, -1);
        return [command, args];
    }
}

export default ClearPrefixMessage;