import { IUser } from 'app/entities/user/user.model';
import { IRatingUser } from 'app/entities/rating-user/rating-user.model';
import { ICommentUser } from 'app/entities/comment-user/comment-user.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';
interface InternalUserData {
  activated: boolean;
  authorities: string[];
  createdBy: string
  createdDate: Date;
  email: string
  firstName: string
  id: number
  imageUrl: string
  langKey: string
  lastModifiedBy: string
  lastModifiedDate: Date;
  lastName: string
  login: string
}

interface DoctorUserData {
  id: number;
  internalUser: InternalUserData;
  specialty: string;
}

abstract class PersonalData {
  public activated = false;
  public firstName = '';
  public email = '';
  public id = -1
  public langKey = 'es';
  public lastName = '';
  public login = '';
  public authorities: string[];
  public imageUrl: string;


  protected constructor({ activated, firstName, email, id, langKey, lastName, login, authorities, imageUrl }: InternalUserData) {
    this.activated = activated;
    this.firstName = firstName;
    this.email = email;
    this.id = id;
    this.langKey = langKey;
    this.lastName = lastName;
    this.login = login;
    this.authorities = authorities;
    this.imageUrl = imageUrl;
  }

  get internalUserData(): {}{
    return {
      login: this.login,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      langKey: this.langKey
    };
  }
}
export interface IDoctor {
  id?: number;
  specialty?: string | null;
  active?: boolean | null;
  internalUser?: IUser | null;
  ratingUsers?: IRatingUser[] | null;
  commentUsers?: ICommentUser[] | null;
  internalUsers?: IAppointment[] | null;
}

class DoctorModel extends PersonalData{
  public doctorId: number;
  public specialty: string;

  constructor({id, internalUser, specialty}: DoctorUserData) {
    super(internalUser);
    this.doctorId = id;
    this.specialty = specialty;
  }

  get doctorData(): {}{
    return {
      specialty: this.specialty
    }
  }
}


export class Doctor implements IDoctor {
  constructor(
    public id?: number,
    public specialty?: string | null,
    public active?: boolean | null,
    public internalUser?: IUser | null,
    public ratingUsers?: IRatingUser[] | null,
    public commentUsers?: ICommentUser[] | null,
    public internalUsers?: IAppointment[] | null
  ) {
    this.active = this.active ?? false;
  }
}

export function getDoctorIdentifier(doctor: IDoctor): number | undefined {
  return doctor.id;
}
