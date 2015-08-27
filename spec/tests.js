"use strict";


describe("general", function() {
    it("lib is available", function() {
        expect(vnerv).toBeDefined();
    });
});

describe("ON function", function() {
    var CHANNEL = "myChannel";
    var ROUTE = "myRoute";
    var DEFAULT_ROUTE = "__root";
    var routes;

    beforeEach(function() {
        routes = vnerv.resetEventBus();
    });

    it("should throw error if no argument is passed", function() {
        expect(function() {
            vnerv.on();
        }).toThrowError();
    });

    it("should throw error if only one argument is passed", function() {
        expect(function() {
            vnerv.on(CHANNEL);
        }).toThrowError();
    });

    it("should throw error if two strings are passed", function() {
        expect(function() {
            vnerv.on(CHANNEL, ROUTE);
        }).toThrowError();
    });

    it("should attach listener on a channel on a default route", function() {
        //given
        var callbackFun = jasmine.createSpy('callbackFun');

        //when
        vnerv.on(CHANNEL, callbackFun);

        //then
        expect(vnerv.getEventBus()[CHANNEL][DEFAULT_ROUTE].length).toBe(1);
    });

    it("should attach listener on a route of a channel", function() {
        //given
        var callbackFun = jasmine.createSpy('callbackFun');

        //when
        vnerv.on(CHANNEL, ROUTE, callbackFun);

        //then
        expect(vnerv.getEventBus()[CHANNEL][ROUTE].length).toBe(1);
    });

    it("should attach listener with specific callback on a route of a channel", function() {
        //given
        var callbackFun = function() {
        };


        //when
        vnerv.on(CHANNEL, ROUTE, callbackFun);

        //then
        expect(vnerv.getEventBus()[CHANNEL][ROUTE].shift().callback).toBe(callbackFun);
    });

});

describe("SEND function", function() {
    var CHANNEL = "myChannel";
    var CHANNEL2 = "myChannel2";
    var ROUTE = "myRoute";
    var ROUTE2 = "myRoute2";
    var listener1Route1, listener2Route1, listener1Route2;
    var routes;

    beforeEach(function() {
        routes = vnerv.resetEventBus();

        listener1Route1 = {
            callback: function() {
            }
        };

        listener2Route1 = {
            callback: function() {
            }
        };

        listener1Route2 = {
            callback: function() {

            }
        };

        routes[CHANNEL] = {};
        routes[CHANNEL][ROUTE] = [listener1Route1, listener2Route1];
        routes[CHANNEL2] = {};
        routes[CHANNEL2][ROUTE2] = [listener1Route2];

        spyOn(listener1Route1, 'callback');
        spyOn(listener2Route1, 'callback');
        spyOn(listener1Route2, 'callback');
    });

    it("should throw an error if no argument is provided", function() {
        expect(function() {
            vnerv.send()
        }).toThrowError();
    });

    it("should not call listener callback for not existing channel&route", function() {
        //when
        vnerv.send("NOT_EXISTING", "NOT_EXISTING");

        //then
        expect(listener1Route1.callback).not.toHaveBeenCalled();
        expect(listener1Route2.callback).not.toHaveBeenCalled();
    });

    it("should not call any callback for not existing channel", function() {
        //when
        vnerv.send("NOT_EXISTING");

        //then
        expect(listener1Route1.callback).not.toHaveBeenCalled();
        expect(listener1Route2.callback).not.toHaveBeenCalled();
    });

    it("should call listener callback for existing channel and route without DTO", function() {
        //when
        vnerv.send(CHANNEL, ROUTE);

        //then
        expect(listener1Route1.callback).toHaveBeenCalled();
        expect(listener2Route1.callback).toHaveBeenCalled();
        expect(listener1Route2.callback).not.toHaveBeenCalled();
    });

    it("should call listeners callback for existing channel&route with DTO", function() {
        //given
        var dto = {message: "ddd"};

        //when
        vnerv.send(CHANNEL, ROUTE, dto);

        //then
        expect(listener1Route1.callback).toHaveBeenCalledWith(dto);
        expect(listener2Route1.callback).toHaveBeenCalledWith(dto);
        expect(listener1Route2.callback).not.toHaveBeenCalled();
    });

    it("should call all listeners callbacks for existing channel without DTO", function() {
        //when
        vnerv.send(CHANNEL);

        //then
        expect(listener1Route1.callback).toHaveBeenCalled();
        expect(listener2Route1.callback).toHaveBeenCalled();
        expect(listener1Route2.callback).not.toHaveBeenCalled();
    });

    it("should call all listeners callbacks for existing channel along with DTO", function() {
        //given
        var dto = {message: "ddd"};

        //when
        vnerv.send(CHANNEL, dto);

        //then
        expect(listener1Route1.callback).toHaveBeenCalledWith(dto);
        expect(listener2Route1.callback).toHaveBeenCalledWith(dto);
        expect(listener1Route2.callback).not.toHaveBeenCalled();
    });
});