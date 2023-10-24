const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const http = require('http');
const Message = require('./models/Message');
const socketManager = require('./socketManager')

const port = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = socketManager.init(server);

app.use(express.static(path.join(__dirname, '../client/build')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: (process.env.CORS_ORIGIN) || (process.env.DEV_ORIGIN) }));

app.use("/api/user", require('./routes/userRoutes'));
app.use("/api/book", require('./routes/bookRoutes'));
app.use("/api/post", require('./routes/postRoutes'));
app.use("/api/message", require('./routes/messageRoutes'));

try {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("connected to the mongoDB database");
} catch (error) {
    console.log("Failed to connect to MongoDB");
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    socket.join(userId);

    socket.on('send_message', async (data) => {
        try {
            console.log('Data received on send_message event: ', data);

            if (data && typeof data.text === 'string' && data.text.length <= 500) {
                const message = new Message({ 
                    text: data.text,
                    sender: data.sender,
                    receiver: data.receiver,
                    createdAt: new Date()
                });


                const savedMessage = await message.save();

                const fetchedMessage = await Message.findById(savedMessage._id)
                    .populate('receiver', 'userName')
                    .populate('sender', 'userName')
                    .exec();
                

                io.to(data.sender).to(data.receiver).emit('receive_message', fetchedMessage);
                console.log('Emitting receive_message event with message:', fetchedMessage);
            } else {
                socket.emit('error', { message: 'Invalid message data' });
            };
        } catch (error) {
            console.log('Error caught on send_message event: ', error);
            socket.emit('error', { message: 'An error occured while saving the message'});
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});