var icon = {};

var faders = {
  "[Channel1],volume": '0',
  "[EqualizerRack1_[Channel1]_Effect1],parameter3": '1',
  "[EqualizerRack1_[Channel1]_Effect1],parameter2": '2',
  "[EqualizerRack1_[Channel1]_Effect1],parameter1": '3',
  "[Channel2],volume": '4',
  "[EqualizerRack1_[Channel2]_Effect1],parameter3": '5',
  "[EqualizerRack1_[Channel2]_Effect1],parameter2": '6',
  "[EqualizerRack1_[Channel2]_Effect1],parameter1": '7',
  "[Master],crossfader": '8',
};

var faderLinearity = {
  "0": true,
  "1": false,
  "2": false,
  "3": false, 
  "4": true,
  "5": false,
  "6": false,
  "7": false, 
};

var faderIsCrossfader = {
  "8": true, 
}

icon.init = function (id, debugging) {
    for (fader in faders) {
        var group_and_param = fader.split(",");
        adjustParam(engine.getParameter(group_and_param[0], group_and_param[1]), group_and_param[0], group_and_param[1]);
    }
}

icon.shutdown = function (id, debugging) {
    DeckOneVolumeConnection.disconnect();
    DeckOneHighEQConnection.disconnect();
    DeckOneMidEQConnection.disconnect();
    DeckOneLowEQConnection.disconnect();

    DeckTwoVolumeConnection.disconnect();
}



var adjustParam = function (value, group, control) {
    fader = faders[group + ',' + control];
    print(value);

    if (faderIsCrossfader[fader]) {
        print("Setting value on crossfader " + fader + " to: " + script.absoluteLinInverse(value, -1, 1, 0, 0, 127));
        midi.sendShortMsg('0xE' + (0 + parseInt(fader)), fader,  script.absoluteLinInverse(value, -1, 1, 0, 0, 127));
    }
    else if (faderLinearity[fader]) {
        print("Setting value on fader " + fader + " to: " + script.absoluteLinInverse(value, 0, 1, 4, 0, 127));
        midi.sendShortMsg('0xE' + (0 + parseInt(fader)), fader, script.absoluteLinInverse(value, 0, 1, 4, 0, 127));
    } else {
        print("Setting value on fader " + fader + " to: " + script.absoluteNonLinInverse(value, 0, 1, 4, 0, 127));
        midi.sendShortMsg('0xE' + (0 + parseInt(fader)), fader, script.absoluteNonLinInverse(value, 0, 1, 4, 0, 127));
    }
};

var deckOneVolumeConnection = engine.makeConnection('[Channel1]', 'volume', adjustParam);
var deckOneHighEQConnection = engine.makeConnection('[EqualizerRack1_[Channel1]_Effect1]', 'parameter3', adjustParam);
var deckOneMidEQConnection = engine.makeConnection('[EqualizerRack1_[Channel1]_Effect1]', 'parameter2', adjustParam);
var deckOneLowEQConnection = engine.makeConnection('[EqualizerRack1_[Channel1]_Effect1]', 'parameter1', adjustParam);

var deckTwoLowEQConnection = engine.makeConnection('[Channel2]', 'volume', adjustParam);
var deckTwoHighEQConnection = engine.makeConnection('[EqualizerRack1_[Channel2]_Effect1]', 'parameter3', adjustParam);
var deckTwoMidEQConnection = engine.makeConnection('[EqualizerRack1_[Channel2]_Effect1]', 'parameter2', adjustParam);
var deckTwoLowEQConnection = engine.makeConnection('[EqualizerRack1_[Channel2]_Effect1]', 'parameter1', adjustParam);

var crossFaderConnection = engine.makeConnection('[Master]', 'crossfader', adjustParam);


