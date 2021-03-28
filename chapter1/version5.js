/**
 * version 5 - extract volumeCreditsFor and format func usd
 */
import fs from 'fs'

const playsStr = fs.readFileSync("./plays.json", "utf-8");
const invoicesSte = fs.readFileSync("./invoices.json", "utf-8");

const plays = JSON.parse(playsStr);
const invoices = JSON.parse(invoicesSte);

function playFor(aPerformance) {
    return plays[aPerformance.playID]
}

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

/**
 * ===== Round1 BEGIN ====
 * new function
 */
function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
    return result;
}

/**
 * ==== Round2 Begin ====
 * extract
 */
function usd() {
    return new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;
}


function statement (invoice) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;


    /**
     * ==== Round 2 ===
     * remove format here, old:
     * const format = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format;
     */


    for (let perf of invoice.performances) {

        /**
         * ===== Round1 BEGIN ====
         * old:
         * volumeCredits += Math.max(perf.audience - 30, 0);
         * if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
         */
        volumeCredits += volumeCreditsFor(perf);

        result += `  ${playFor(perf).name}: ${usd(amountFor(perf)/100)} (${perf.audience} seats)\n`;
        totalAmount += amountFor(perf);
    }
    result += `Amount owed is ${usd(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}

const res = statement(
    invoices[0],
    plays
)
console.log(res)
