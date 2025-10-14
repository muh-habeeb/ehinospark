import mongoose, { Document, Schema } from 'mongoose';

export interface IHeroSection extends Document {
  title: string;
  subtitle: string;
  images: {
    url: string;
    alt: string;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSectionSchema = new Schema<IHeroSection>({
  title: {
    type: String,
    required: true,
    default: 'ETHNOSPARK 2025'
  },
  subtitle: {
    type: String,
    required: true,
    default: 'College Ethnic Day – Celebrating Culture, Unity & Diversity'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: 'Hero Image'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export interface IProgram extends Document {
  name: string;
  description: string;
  image: string;
  time?: string;
  location?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProgramSchema = new Schema<IProgram>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  time: String,
  location: String,
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export interface ISchedule extends Document {
  time: string;
  title: string;
  description: string;
  location?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSchema = new Schema<ISchedule>({
  time: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: String,
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export interface IGalleryImage extends Document {
  url: string;
  alt: string;
  caption?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>({
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  caption: String,
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export interface ITeamMember extends Document {
  name: string;
  role: string;
  image: string;
  bio?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  bio: String,
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export interface IAnnouncement extends Document {
  text: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>({
  text: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: Date,
  endDate: Date
}, {
  timestamps: true
});

export interface IAdmin extends Document {
  username: string;
  password: string;
  email?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Export models
export const HeroSection = mongoose.models.HeroSection || mongoose.model<IHeroSection>('HeroSection', HeroSectionSchema);
export const Program = mongoose.models.Program || mongoose.model<IProgram>('Program', ProgramSchema);
export const Schedule = mongoose.models.Schedule || mongoose.model<ISchedule>('Schedule', ScheduleSchema);
export const GalleryImage = mongoose.models.GalleryImage || mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema);
export const TeamMember = mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
export const Announcement = mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);