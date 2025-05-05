addLayer("me", {
    name: "Magical Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ME", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00F5FF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "magical energy", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
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
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
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
            cost: new Decimal(5),
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
            cost: new Decimal(30),
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
            cost: new Decimal(100),
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

        },
        24:{

        },
        25:{

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
    }

)
