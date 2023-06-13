
import chalk from 'chalk'
import inquirer from 'inquirer'

import fs from 'fs'

operation()

function operation(){

    inquirer.prompt([
    {
        type: 'list',
        name: 'action', 
        message: 'O que voce deseja fazer?', 
        choices: [
            "Criar conta",
            "Consultar saldo",
            "Depositar",
            "Sacar",
            "Sair",
        ],
    },
])   
.then((answers) => {
    const action = answers['action']

    if (action == 'Criar conta') {
        createAccount()
    } else if (action === 'Depositar'){
      deposit()
    } else if (action ==='Consultar saldo'){
      getAccountBalance()
    } else if (action === 'Sacar'){
      widthdraw()
    } else if (action === 'Sair'){
      console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
      process.exit()
     }
})

.catch(err => console.error(err));

}

function createAccount() {
    console.log(chalk.bgGreen.black('Parabéns por escolher nosso banco!'))
    console.log(chalk.green('Defina as opcoes da sua conta a seguir'))

    buildAccount()
}

//criar conta
function buildAccount() {
    inquirer.prompt([
        {
          name: 'accountName',
          message: 'Digite um nome para a sua conta:',
        },
      ])
      
      
  .then((answer) => {
      console.info(answer['accountName'])
  
      const accountName = answer['accountName']
  
      if (!fs.existsSync('accounts')) {
        fs.mkdirSync('accounts')
      }
  
      if (fs.existsSync(`accounts/${accountName}.json`)) {
          console.log(
          chalk.bgRed.black('Esta conta já existe, escolha outro nome!'),
          )
        buildAccount()
      }else {
        console.log(chalk.green('Parabéns, sua conta foi criada!'))
      }
      

        
    fs.writeFileSync(
      `accounts/${accountName}.json`,
      '{"balance":0}',
      function(err) {
        console.log(err)
      },
    )
    })
    
  }


//deposito na conta

function deposit() {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da sua conta? ',
      }
  ])
  .then((answer) => {
      const accountName = answer['accountName']

      //verificar se a conta existe
      if (!checkAccount(accountName)) {
          return deposit()
      }

      inquirer 
        .prompt([
          {
            name: 'amount',
            message: 'Qual valor voce deseja depositar?'
          },
        ])
        .then((answer) => {

          const amount = answer['amount'] 

          //adicionar saldo
          operation()
          addAmount(accountName, amount)

        }).catch((err) => console.log(err))
  })
  .catch((err) => console.log(err))
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
    return false
  }
  return true
}

function addAmount(accountName, amount) {
    const accountData  = getAccount(accountName)

    if(!amount){
      console.log(chalk.bgRed('Ocorreu um erro tente novamente mais tarde!'))
      return deposit()
    }
    
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
      `accounts/${accountName}.json`,
      JSON.stringify(accountData),
      function (err) {
        console.log(err)
      }
    )
    
    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta.`))
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    enconding : 'utf8',
    flag: 'r'
  })

  return JSON.parse(accountJSON)
}

function getAccountBalance() {
  inquirer.prompt([ 
    {
      name: 'accountName',
      message: 'Qual o nome da sua conta?',
    }
])
  .then((answer) => {

    const accountName = answer['accountName']
    
    //verificar se a conta existe
    if (!checkAccount(accountName)) {
      return getAccountBalance()
  }
  
  const accountData = getAccount(accountName)

  console.log(chalk.bgBlue.black(`O saldo da sua conta é R$${accountData.balance}`))

  operation()

}) 
  .catch((err) => console.log(err)) 
}

function widthdraw() {
    inquirer.prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da sua conta conta?',
      }
    ])
    .then((answer) => {

      const accountName = answer['accountName']

      if (!checkAccount(accountName)) {
          return widthdraw()
      }

      inquirer.prompt([
        {
          name: 'amount',
          message: 'Qual valor voce deseja sacar?'
        }
      ])
      .then((answer) => {

        const amount = answer['amount']
        removeAmount(accountName, amount)
        
      })
      .catch((err) => console.log(err))
  })
.catch((err) => console.log(err))
}

function removeAmount(accountName, amount) {
  const accountData = getAccount(accountName)

  if (!amount){
    console.log(chalk.bgRed.black('Ocorreu um erro tente novamente mais tarde.'))
    return widthdraw()
  }

  if (accountData.balance < amount) {
    console.log(chalk.bgRed.black('Saldo insuuficiente!'))
    return widthdraw()
  }
  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err)
    }
  )

  console.log(chalk.green(`Foi realizado um saque de R$${amount} na sua conta.`))

  operation()
}
