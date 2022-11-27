exports.merge = (o, settings) => {
    for(let key in settings) {
        if(settings.hasOwnProperty(key))
            o[key] = settings[key];
    }
    return o;
};
