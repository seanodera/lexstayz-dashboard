import {faker} from "@faker-js/faker";


export default function withdrawData(){
    let account = faker.internet.email()
    let withdrawals = [];
    for (let i = 0; i < 20; i++){
        withdrawals.push({
            id: faker.string.alphanumeric(8),
            method: 'Pryzapay',
            account: account,
            amount: faker.number.int({max: 8000, min: 200}),
            status: 'Completed',
            timeStamp: faker.date.recent(),

        });
    }
    withdrawals.sort((a,b) => a.timeStamp.getSeconds() - b.timeStamp.getSeconds())
    return {
        account: {
            method: 'Pryzapay',
            account: account,
        },
        withdrawals:withdrawals,
    }
}