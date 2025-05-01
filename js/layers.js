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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if (hasUpgrade("me", 13))
            exp = exp.times(upgradeEffect("me", 13))
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
                return player[this.layer].points.add(2).pow(0.5)
            },
            effectDisplay(){
                return format(upgradeEffect(this.layer, this.id))+"x" 
            },
        },
        12:{
            name: "Energy Aggregating",
            description: "<h3>Energy Aggregating</h3><br>Energy gain boost according to itself.",
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
            description: "<h3>Efficient conversion</h3><br>The magical energy gain formula is better.",
            unlocked(){
                return hasUpgrade("me", 12)
            },
            cost: new Decimal(30),
            effect(){
                return new Decimal(1.2)
            },
        }
    }

})
