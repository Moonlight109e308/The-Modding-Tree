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
        sc = new Decimal(500000).minus(player[this.layer].points)
        return sc
    },
    softcapPower(){
        return 0
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("me", 21))
            mult = mult.times(upgradeEffect("me", 21))
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
                return new Decimal(1.15)
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
            cost: new Decimal(1000),
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
            cost: new Decimal(15000),
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
            cost: new Decimal(200000),
            effect(){
                return getBuyableAmount('me', 11)
            },
            effectDisplay(){
                return format(upgradeEffect(this.layer, this.id)) + "x"
            },
        },
        24:{
            name: "?",
            description: "There might be someone that wanna say something to you.",
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
                return hasUpgrade('me', 24)&&getClickableState(this.layer, this.id).lt(7)
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
            "prestige-button",
            "clickables",
            "buyables",
            "upgrades",
        ],
    },
    "power":{
        
        unlocked(){
            return hasUpgrade("me", 25)
        },
        embedLayer: 'mw',
    },
    },
    }

),
addLayer("mw",
    {
        name: "Magical Power",
        symbal: "MW",
        position: 'me',
        color: "#00F5FF",
        startData(){
            return {
                unlocked: true,
                points: new Decimal(0),

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
            x = new Decimal(5).log(40)
            return player.me.points.times(0.000002).exp(x).add(9).log(10).floor()
        },
        getNextAt(){
            y = new Decimal(500000).div(tmp.mw.getResetGain).add(1)
            z = new Decimal(5).log(40)
            n = new Decimal(40).log(5)
            return y.exp(z).exp(n).ceil()
            
        },
        canReset(){
            return tmp.mw.getResetGain.gt(0)
        },
        prestigeButtonText(){
            return "+" + format(tmp.mw.getResetGain) + " Magical Powers<br>"
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
        row: 0,
        hotkeys: [
        {key: "P", description: "P: Reset for Magical Power", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        upgrades: {
            11:{
                name: "When I Have Been Exists",
                description:"<h3>When I Have Been Exists</h3><br>Energy gain boost based on time you have played.",
                unlocked(){
                    return player[this.layer].points.gt(0)
                },
                cost: new Decimal(1),

            }
        },
    
    }
)

