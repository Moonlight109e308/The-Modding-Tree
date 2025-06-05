var quotes = ["Hello.", "You may be confused who I am,", "but that's not important.", "What I want to tell you is,", "You are the one that has chosen by me.", "Please proceed,", "until you can find me again."];
addLayer("me", {
    name: "Magical Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ME", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        clickables:{
            [11]: new Decimal(0),
        },
    }},
    color: "#00F5FF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "magical energy", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    softcap(){
        sc = new Decimal(500000)
        if(getBuyableAmount("mw", 11).gt(0.9))
            sc = sc.times(buyableEffect('mw', 11))
        if(getBuyableAmount("mw", 21).gt(0))
            sc = sc.times(buyableEffect('mw', 21))
        return sc.minus(player[this.layer].points)
    },
    softcapPower(){
        return 0
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("me", 21))
            mult = mult.times(upgradeEffect("me", 21))
        if (hasUpgrade('mw', 12))
            mult = mult.times(upgradeEffect('mw', 12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade("me", 13))
            exp = exp.times(upgradeEffect("me", 13))
        if (hasUpgrade("me", 14))
            exp = exp.times(0.95)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "E", description: "E: Reset for Magical Energy", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades:{
        11:{
            name: "Feel The Energy",
            description: "<h3>Feel The Energy</h3><br>Energy gain boost according to magical energy.",
            cost: new Decimal(1),
            unlocked(){
                return true
            },
            effect(){
                eff = player[this.layer].points.add(2).pow(0.5)
                if (hasUpgrade("me", 22))
                    eff = eff.times(upgradeEffect("me", 22))
                if (eff > 2000)
                    eff = eff.sub(2000).pow(0.75).add(2000)
                return eff
            },
            effectDisplay(){
                if(upgradeEffect(this.layer, this.id) <= 2000)
                    return format(upgradeEffect(this.layer, this.id))+"x" 
                if(upgradeEffect(this.layer, this.id) > 2000)
                    return format(upgradeEffect(this.layer, this.id))+"x(softcapped)"
            },
        },
        12:{
            name: "Energy Aggregating",
            description: "<h3>Energy Aggregating</h3><br>Energy gain boost based on itself.",
            cost: new Decimal(2),
            unlocked(){
                return hasUpgrade("me", 11)
            },
            effect(){
                return player.points.add(1).log10().add(1).pow(1.5)
            },
            effectDisplay(){
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
        },
        13:{
            name: "Efficient conversion",
            description: "<h3>Efficient Conversion</h3><br>The magical energy gain formula is better.",
            unlocked(){
                return hasUpgrade("me", 12)
            },
            cost: new Decimal(15),
            effect(){
                return new Decimal(1.2)
            },
        },
        14:{
            name: "Power Diverging",
            description: "<h3>Power Diverging</h3><br>You gain magical energy to the power of 0.95, but you gain energy to the power of 1.15.",
            unlocked(){
                return hasUpgrade("me", 13)
            },
            cost: new Decimal(80),
            effect(){
                eff = new Decimal(1.15)
                if(hasUpgrade('mw', 21))
                    eff = eff + upgradeEffect('mw', 21)
                return eff
            },
        },
        15:{
            name: "Source of Magic",
            description: "<h3>Source of Magic</h3><br>Unlock source of magic, the first repeatable purchase.",
            unlocked(){
                return hasUpgrade("me", 14)
            },
            cost: new Decimal(200),
        },
        21:{
            name: "Magic Attracting",
            description: "<h3>Magic Attracting</h3><br>You gain more magical energy based on the amount of source of magic you have.",
            unlocked(){
                return hasUpgrade("me", 15)
            },
            cost: new Decimal(500),
            effect(){
                return getBuyableAmount("me", 11).add(1).pow(3).log10().add(1)
            },
            effectDisplay(){
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
        },
        22:{
            name: "Stronger Magical Soul",
            description: "<h3>Stronger Magical Soul</h3><br>Magical Energy boosts the Upgrade 11(Feel The Energy).",
            unlocked(){
                return hasUpgrade("me", 21)
            },
            cost: new Decimal(10000),
            effect(){
                return player[this.layer].points.add(1).log10().add(1)
            },
            effectDisplay(){
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
        },
        23:{
            name: "Powerful Source",
            description: "<h3>Powerful Source</h3><br>Energy gain boost equal to the amount of source of magic.",
            unlocked(){
                return hasUpgrade('me', 22)
            },
            cost: new Decimal(100000),
            effect(){
                return getBuyableAmount('me', 11).add(1)
            },
            effectDisplay(){
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
        },
        24:{
            name: "?",
            description: function(){
                if(hasMilestone('mw', 0) == false)
                    return "There might be someone that wanna say something to you."
                if(hasMilestone('mw', 0) == true)
                    return "Don't mind it. Keep proceed."
            },
            unlocked(){
                return hasUpgrade('me', 23)
            },
            cost:new Decimal(0),
        },
        25:{
            name: "Power Visualization",
            description: "<h3>Power Visualization</h3><br>Unlocked the Magical Power tab.",
            unlocked(){
                return hasUpgrade('me', 24)
            },
            cost:new Decimal(500000),
        },
        },
    buyables:{
        11:{
            title: "Source of Magic",
            unlocked(){
                return hasUpgrade("me", 15)
            },
            cost(){
                return new Decimal(4).pow(getBuyableAmount(this.layer,this.id)).times(5)
            },
            display(){
                return "<h3>You have " + format(new Decimal(getBuyableAmount(this.layer, this.id))) + " source of magic.<br>" +
                "Each source of magic will let you gain 50% more energy.<br>" +
                "cost:" + format(this.cost()) + " magical energy<br>" +
                "Current effect:" + format(new Decimal(1.5).pow(getBuyableAmount(this.layer, this.id))) + "x"
            },
            canAfford(){
                return (player[this.layer].points.gte(this.cost()))
            },
            buy(){
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },
    clickables: {
        11:{
            unlocked(){
                return hasUpgrade('me', 24)&&getClickableState(this.layer, this.id).lt(7)&&!hasMilestone('mw', 0)
            },
            canClick(){
                return hasUpgrade('me', 24)
            },
            onClick(){
                setClickableState(this.layer, this.id, getClickableState(this.layer, this.id).add(1))
            },
            display(){
                return quotes[getClickableState(this.layer, this.id).toNumber()]
            },

         },
    },
tabFormat: {
    "energy": {
        content:[
            "main-display",
            ["display-text",
                function(){
                    return "Capped at " + format(tmp.me.softcap.add(player.me.points)) + " magical energy"
                }
            ],
            "blank",
            "prestige-button",
            "clickables",
            "buyables",
            "upgrades",
        ],
    },
    "power":{
        
        unlocked(){
            return hasUpgrade("me", 25)||hasMilestone('mw', 0)
        },
        embedLayer: 'mw',
    },
    },
    }

),
addLayer("mw",
    {
        name: "Magical Power",
        symbal: "MP",
        position: 'me',
        color: "#00F5FF",
        startData(){
            return {
                unlocked(){
                    return hasUpgrade('me', 25)||hasMilestone('mw', 0)
                },
                points: new Decimal(0),
                getting: new Decimal(0),
            }
        },
        requires: new Decimal(500000),
        resource: "Magical Power",
        baseResource: "Magical Energy",
        baseAmount(){
            return player.me.points
        },
        type: "custom",
        getResetGain(){
            return player.me.points.div(500000).pow(new Decimal(5).log10().div(new Decimal(40).log10())).floor()
        },
        getNextAt(){
            let qwq=new Decimal(40).log10().div(new Decimal(5).log10())
            return tmp.mw.getResetGain.add(1).floor().pow(qwq).times(500000).ceil()
            
        },
        canReset(){
            return tmp.mw.getResetGain.gt(0)
        },
        prestigeButtonText(){
            if(tmp.mw.getResetGain.lt(100))
                return "Reset your energy and magical energy for " + format(tmp.mw.getResetGain) + " Magical Powers<br>Next at " + format(tmp.mw.getNextAt) + " magical energy"
            if(tmp.mw.getResetGain.gt(99))
                return "Reset your energy and magical energy for " + format(tmp.mw.getResetGain) + " Magical Powers"
        },
        gainMult(){
            mult = new Decimal(1)
            return mult
        },
        gainExp(){
            exp = new Decimal(1)
            return exp
        },

        layerShown(){
            return false
        },
        row: 1,
        hotkeys: [
        {key: "P", description: "P: Reset for Magical Power", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        upgrades: {
            11:{
                name: "When I Have Been Exists",
                description:"<h3>When I Have Been Exists</h3><br>Energy gain boost based on time you have played.",
                unlocked(){
                    return hasMilestone('mw', 0)
                },
                cost: new Decimal(1),
                effect(){
                    return new Decimal(player.timePlayed).log10().pow(1.5)
                },    
                effectDisplay(){
                    return format(upgradeEffect(this.layer,this.id)) + 'x'
                },
            },
            12:{
                name: "Fill in Myself with Power",
                description:"<h3>Fill in Myself with Power</h3><br>Magical Energy gain boost based on your Magical Power amount.",
                unlocked(){
                    return hasMilestone('mw', 0)
                },
                cost: new Decimal(1),
                effect(){
                    return player[this.layer].points.add(3).pow(0.75)
                },
                effectDisplay(){
                    return format(upgradeEffect(this.layer,this.id)) + 'x'
                },
            },
            13:{
                name: "Sacrifice of Magic",
                description:"<h3>Sacrifice of Magic</h3><br>Unlock Magical Power Sacrifice, which can improve your Magical Energy cap.",
                unlocked(){
                    return hasMilestone('mw', 0 )
                },
                cost: new Decimal(3),
            },
            21:{
                name: "Powerful Power Diverging",
                description:"<h3>Powerful Power Diverging</h3><br>Magical Energy Upgrade 14(Power Diverging) is stronger(add 0.15 to energy gain power).",
                unlocked(){
                    return hasMilestone('mw', 2)
                },
                cost: new Decimal(50),
                effect(){
                    eff = 0.15
                    return eff
                },
                effectDisplay(){
                    return format(upgradeEffect(this.layer, this.id)) + 'x'
                },
            },
            22:{
                name: "Stronger Sacrifice",
                description:"<h3>Stronger Sacrifice</h3><br>Magical Power Sacrifice is to the power of 1.25.",
                unlocked(){
                    return hasMilestone('mw', 2)
                },
                cost: new Decimal(100),
                effect(){
                    eff = 1.25
                    return eff
                },
            },
            23:{
                name: "Element Conversion",
                description: "<h3>Element Conversion</h3><br>Unlock Elements.",
                unlocked(){
                    return hasMilestone('mw', 2)
                },
                cost: new Decimal(1000),
            },
        },
        milestones:{
            0:{
                requirementDescription: "1 Magical Power",
                effectDescription:"Unlock Magical Power upgrade 11/12/13.",
                done(){
                    return player.mw.points.gte(0.999)
                },
            },
            1:{
                requirementDescription: "get 2 or more Magical Power at once",
                effectDescription:"Unlock Magic spell.",
                done(){
                    return player.mw.getting.gte(2)
                },
            },
            2:{
                requirementDescription: "50 Magical Power",
                effectDescription:"Unlock Magical Power upgrade 21/22/23 and two new spells.",
                done(){
                    return player.mw.points.gte(50)
                },
            }
            
        },
        buyables:{
            11:{
                title: "Magical Power Sacrifice",
                unlocked(){
                    return hasUpgrade("mw", 13)
                },
                cost(){
                    return new Decimal(1)
                },
                effect(){
                    effect = getBuyableAmount(this.layer,this.id).times(0.3).add(1)
                    if (hasUpgrade('mw', 22))
                        effect = effect.pow(1.25)
                    if (getBuyableAmount('mw', 22).gt(0))
                        effect = effect.pow(2)
                    return effect
                },
                display(){
                    return "<h3>You have sacrificed " + format(new Decimal(getBuyableAmount(this.layer, this.id))) + " magical power.</h3><br> <br>" +
                    "Sacrificeing magical power will spend all your magical power and improve your magical energy cap.<br> <br>" +
                    "Current effect: " + format(buyableEffect('mw', 11)) + "x"
                },
                canAfford(){
                    return (player[this.layer].points.gt(0.9))
                },
                buy(){           
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(player[this.layer].points.div(tmp.mw.buyables[11].cost)))
                    player[this.layer].points = new Decimal(0)
                },
            },
            21:{
                title: "Spell Flux",
                unlocked(){
                    return hasMilestone('mw', 1)
                },
                cost(){
                    return new Decimal(1)
                },
                effect(){
                    effect = new Decimal(10)
                    return effect
                },
                display(){
                    return "<h3>This spell can make your magical energy cap higher.</h3><br> <br>" +
                    "Current effect: " + format(buyableEffect('mw', 21)) + "x<br> <br>" +
                    "Spell could be active for " + format(new Decimal(getBuyableAmount(this.layer, this.id))) + 's<br> <br>' +
                    "cost: " + format(this.cost()) + " Magical Power"
                },
                canAfford(){
                    return player[this.layer].points.gt(0.9)&&getBuyableAmount(this.layer, this.id).lte(0)
                },
                buy(){
                    x = new Decimal(30)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(x))
                    player[this.layer].points = player[this.layer].points.minus(this.cost())
                },
                
            },
            22:{
                title: "Sacrifice of Mana",
                unlocked(){
                    return hasMilestone('mw', 2)
                },
                cost(){
                    return new Decimal(15)
                },
                effect(){
                    effect = new Decimal(2)
                    return effect
                },
                display(){
                    return "<h3>This speel can make your magical power sacrifice squared.</h3><br> <br>"+
                    "Spell could be active for " + format(new Decimal(getBuyableAmount(this.layer,this.id))) + "s<br> <br>" +
                    "cost: " + format(this.cost()) + " Magical Power"
                },
                canAfford(){
                    return player[this.layer].points.gte(15)&&getBuyableAmount(this.layer, this.id).lte(0)
                },
                buy(){
                    x = new Decimal(90)
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(x))
                    player[this.layer].points = player[this.layer].points.minus(this.cost())
                },
            },
            23:{
                title: "Energy Rage",
                unlocked(){
                    return hasMilestone('mw', 2)
                },
                cost(){
                    return new Decimal(10)
                },
                effect(){
                    effect = new Decimal(100)
                    return effect
                },
                display(){
                    return "<h3>This spell can greatly boost your energy gain.</h3><br> <br>" +
                    "Current effect: " + format(buyableEffect('mw', 23)) + "x<br> <br>" +
                    "Spell could be active for " + format(new Decimal(getBuyableAmount(this.layer,this.id))) + "s<br> <br>" +
                    "cost: " + format(this.cost()) + " Magical Power"
                },
                canAfford(){
                    return player[this.layer].points.gte(10)&&getBuyableAmount(this.layer, this.id).lte(0)
                },
                buy(){
                    x = new Decimal(45)
                    setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer, this.id).add(x))
                    player[this.layer].points = player[this.layer].points.minus(this.cost())
                },
            }
            
            
        },
        update(diff){
            if(getBuyableAmount('mw', 21).gt(0))        
                setBuyableAmount('mw', 21, getBuyableAmount('mw', 21).minus(diff))
            if(getBuyableAmount('mw', 22).gt(0))
                setBuyableAmount('mw', 22, getBuyableAmount('mw', 22).minus(diff))
            if(getBuyableAmount('mw', 23).gt(0))
                setBuyableAmount('mw', 23, getBuyableAmount('mw', 23).minus(diff))
            },
        tabFormat: {
         "power": {
            content:[
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "milestones",
                ["buyables", [1]],
                "upgrades",
            ],
        },
        "spell":{
            unlocked(){
                return hasMilestone('mw', 1)
            },
            content:[
                "main-display",
                "blank",
                "milestones",
                ["buyables", [2]],
            ],
        },
    
        },
    }
)

