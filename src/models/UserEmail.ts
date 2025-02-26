import mongoose from 'mongoose';

const UserEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: (props: { value: string }) => `${props.value} is not a valid email address!`,
    },
  },
}, { timestamps: true });

const UserEmail = mongoose.models.UserEmail || mongoose.model('UserEmail', UserEmailSchema);
export default UserEmail;
