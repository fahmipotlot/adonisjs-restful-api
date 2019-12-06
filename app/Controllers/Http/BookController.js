'use strict'

const Book = use('App/Models/Book')
const { validate } = use('Validator')
    
class BookController {
    async index ({request, response}) {
        let params = request.only(['page', 'per_page', 'q', 'sort_field', 'sort_order'])
        const page = params.page || 1
        const per_page = params.per_page || 10
        const q = params.q
        const sort_field = params.sort_field
        const sort_order = params.sort_order

        const query = Book.query()

        // search
        if (q) {
            query.whereRaw("title ILIKE ?", [`%${q}%`])
                .orWhereRaw("isbn ILIKE ?", [`%${q}%`])
                .orWhereRaw("publisher_name ILIKE ?", [`%${q}%`])
                .orWhereRaw("author_name ILIKE ?", [`%${q}%`])
        }

        // sort
        if (sort_field) {
            const order = await sort_order == 'asc' ? 'asc' : 'desc';
            query.orderBy(sort_field, order)
        } else {
            query.orderBy('id', 'desc')
        }

        // paginate
        const books = await query.paginate(page, per_page)       

        return response.json(books)
    }

    async show ({params, response}) {
        const book = await Book.find(params.id)

        return response.json(book)
    }

    async store ({request, response}) {
        const bookInfo = request.only(['title', 'isbn', 'publisher_name', 'author_name'])

        const rules = {
            title: 'required|min:3',
            isbn: 'required|min:5',
            publisher_name: 'required|min:5',
            author_name: 'required|min:5'
        }
      
        const validation = await validate(bookInfo, rules)

        if (validation.fails()) {
            return response.status(422).json(validation.messages())
        }

        try {
            const book = new Book()
            book.title = bookInfo.title
            book.isbn = bookInfo.isbn
            book.publisher_name = bookInfo.publisher_name
            book.author_name = bookInfo.author_name

            await book.save()

            return response.status(201).json(book)
        } catch (e) {
            return response.status(422).json({
                message: 'The books is unable to create.',
                status_code: 422
            })
        }
    }

    async update ({params, request, response}) {
        const bookInfo = request.only(['title', 'isbn', 'publisher_name', 'author_name'])

        const book = await Book.find(params.id)
        if (!book) {
            return response.status(404).json({data: 'Resource not found'})
        }

        const rules = {
            title: 'required|min:3',
            isbn: 'required|min:5',
            publisher_name: 'required|min:5',
            author_name: 'required|min:5'
        }
      
        const validation = await validate(bookInfo, rules)

        if (validation.fails()) {
            return response.status(422).json(validation.messages())
        }

        try {
            book.title = bookInfo.title
            book.isbn = bookInfo.isbn
            book.publisher_name = bookInfo.publisher_name
            book.author_name = bookInfo.author_name

            await book.save()

            return response.status(200).json(book)
        } catch (e) {
            return response.status(422).json({
                message: 'The books is unable to update.',
                status_code: 422
            })
        }
    }

    async delete ({params, response}) {
        const book = await Book.find(params.id)
        if (!book) {
            return response.status(404).json({data: 'Resource not found'})
        }
        await book.delete()

        return response.status(204).json(null)
    }
}

module.exports = BookController
