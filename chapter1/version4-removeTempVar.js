/**
 * version 4 - remove temp var
 * function amountFor (arg play)
 */
import fs from 'fs'

const playsStr = fs.readFileSync("./plays.json", "utf-8");
const invoicesSte = fs.readFileSync("./invoices.json", "utf-8");

const plays = JSON.parse(playsStr);
const invoices = JSON.parse(invoicesSte);

/**
 * ==== Begin ====
 */
function playFor(aPerformance) {
    return plays[aPerformance.playID]
}
// ==== END ====


// remove play
function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return result;
}


function statement (invoice) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format;
    for (let perf of invoice.performances) {
        /**
         * ==== Round 1 ====
         * remove play, old:
         * const play = plays[perf.playID];
         * let thisAmount = amountFor(play, perf);
         */

        /**
         * ==== Round 2 ====
         * use inline vars to instead
         * old:
         * const play = playFor(perf);
         * let thisAmount = amountFor(perf);
         *  ==== END =====
         */

        // add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);


        result += `  ${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience} seats)\n`;
        // old: totalAmount += thisAmount;
        totalAmount += amountFor(perf);
    }
    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}

const res = statement(
    invoices[0]
)
console.log(res)
