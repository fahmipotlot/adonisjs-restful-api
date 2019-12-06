'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Book = use('App/Models/Book')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  // auth
  Route.post('/auth/register', 'AuthController.register')
  Route.post('/auth/login', 'AuthController.login')

  // books
  Route.post('books', 'BookController.store').middleware('auth')
  Route.get('books', 'BookController.index').middleware('auth')
  Route.get('books/:id', 'BookController.show').middleware('auth')
  Route.put('books/:id', 'BookController.update').middleware('auth')
  Route.delete('books/:id', 'BookController.delete').middleware('auth')
}).prefix('api/v1')
