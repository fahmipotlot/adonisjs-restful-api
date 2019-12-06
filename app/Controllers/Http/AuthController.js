'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')

class AuthController {
    async register({request, auth, response}) {
        const userData = request.only(['username', 'email', 'password'])

        const rules = {
            email: 'required|email|unique:users,email',
            username: 'required|unique:users,username',
            password: 'required|min:5'
        }
      
        const validation = await validate(userData, rules)

        if (validation.fails()) {
            return response.status(422).json(validation.messages())
        }

        const user = new User()
        user.email = userData.email
        user.username = userData.username
        user.password = userData.password

        await user.save()

        //generate token for user;
        let token = await auth.generate(user)

        Object.assign(user, token)

        return response.json(user)
    }

    async login({request, auth, response}) {

        let {email, password} = request.all();

        try {
            if (await auth.attempt(email, password)) {
                let user = await User.findBy('email', email)
                let token = await auth.generate(user)

                Object.assign(user, token)
                return response.json(user)
            }
        } catch (e) {
            return response.json({message: 'You are not registered!'})
        }
    }
}

module.exports = AuthController