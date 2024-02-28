// ** JWT import
import jwt from 'jsonwebtoken'

// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Default AuthConfig
import defaultAuthConfig from 'src/configs/auth'

const users = [
  {
    id: 1,
    role: 'admin',
    password: 'admin',
    fullName: 'Virendra Admin',
    username: 'Admin',
    email: 'admin@diversitech.com'
  },

  // {
  //   id: 2,
  //   role: 'worker',
  //   password: 'worker',
  //   fullName: 'Abhishek Worker',
  //   username: 'Worker',
  //   email: 'worker@diversitech.com'
  // },
  {
    id: 2,
    role: 'work',
    password: 'work',
    fullName: 'Abhishek Work',
    username: 'Work',
    email: 'work@diversitech.com'
  },
  {
    id: 1,
    role: 'supervisors',
    password: 'supervisors',
    fullName: 'Ayush Supervisor',
    username: 'supervisor',
    email: 'supervisors@diversitech.com'
  }
]

// ! These two secrets should be in .env file and not in any other file
export const jwtConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION,
  refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET
}

// mock.onPost('/jwt/login').reply(request => {
//   const { email, password } = JSON.parse(request.data)

//   let error = {
//     email: ['Something went wrong']
//   }

//   const user = users.find(u => u.email === email && u.password === password)
//   if (user) {
//     const accessToken = jwt.sign({ id: user.id }, jwtConfig.secret, { expiresIn: jwtConfig.expirationTime })

//     const response = {
//       accessToken,
//       userData: { ...user, password: undefined }
//     }

//     return [200, response]
//   } else {
//     error = {
//       email: ['email or Password is Invalid']
//     }

//     return [400, { error }]
//   }
// })

mock.onPost('/jwt/login').reply(async request => {
  const { email, password } = JSON.parse(request.data)
  console.log(email, password)

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    if (response.ok) {
      const data = await response.json()
      console.log(data)

      if (data.success) {
        console.log(data.message)

        return [200, data.message]
      } else {
        console.log('Not Login')
      }
    }
  } catch (error) {
    console.error(error)
  }
})

mock.onPost('/jwt/register').reply(async request => {
  if (request.data.length > 0) {
    const { username, email, password, firstName, lastName, phone, branch_id } = JSON.parse(request.data)

    console.log(username, email, password, firstName, lastName, phone, branch_id)

    try {
      const response = await fetch('/api/auth/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, firstName, lastName, phone, branch_id })
      })
      if (response.ok) {
        const data = await response.json()
        console.log(data)

        if (data.success) {
          console.log(data.message)

          return [200, data.message]
        } else {
          console.log('Not Login')
        }
      }
    } catch (error) {
      console.error(error)
    }

    // const isEmailAlreadyInUse = users.find(user => user.email === email)
    // const isUsernameAlreadyInUse = users.find(user => user.username === username)

    // const error = {
    //   email: isEmailAlreadyInUse ? 'This email is already in use.' : null,
    //   username: isUsernameAlreadyInUse ? 'This username is already in use.' : null
    // }
    // if (!error.username && !error.email) {
    //   const { length } = users
    //   let lastIndex = 0
    //   if (length) {
    //     lastIndex = users[length - 1].id
    //   }

    //   const userData = {
    //     id: lastIndex + 1,
    //     email,
    //     password,
    //     username,
    //     avatar: null,
    //     fullName: '',
    //     role: 'admin'
    //   }
    //   users.push(userData)
    //   const accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret)
    //   const user = { ...userData }
    //   delete user.password
    //   const response = { accessToken }

    //   return [200, response]
    // }

    // return [200, { error }]
  } else {
    return [401, { error: 'Invalid Data' }]
  }
})

mock.onGet('/auth/me').reply(async config => {
  const token = config.headers.Authorization
  let response = [200, {}]
  jwt.verify(token, jwtConfig.secret, async (err, decoded) => {
    if (err) {
      if (defaultAuthConfig.onTokenExpiration === 'logout') {
        response = [401, { error: { error: 'Invalid User' } }]
      } else {
        const oldTokenDecoded = jwt.decode(token, { complete: true })
        const { id: userId } = oldTokenDecoded.payload

        const responses = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userId)
        })
        if (responses.ok) {
          const data = await response.json()
          console.log(data)

          if (data.success) {
            console.log(data.message.accessToken)
            console.log(data.message)
            window.localStorage.setItem(defaultAuthConfig.storageTokenKeyName, data.message.accessToken)
            const obj = data.message
            response = [200, obj]
          } else {
            console.log('Not Login')
          }
        }
      }
    } else {
      const userId = decoded.id

      const responses = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userId)
      })
      if (responses.ok) {
        const data = await response.json()
        console.log(data)

        if (data.success) {
          response = [200, data.message]
        } else {
          console.log('Not Login')
        }
      }
    }
  })

  return response
})
