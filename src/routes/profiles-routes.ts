import { NextFunction, Request, Response, Router } from 'express';
import IUserModel, { User } from '../database/models/user.model';
import { authentication } from '../utilities/authentication';
import { ProfileController } from '../controllers/profile.controller';
import { sendNotFound } from '../utilities/response';

const router: Router = Router();


/**
 * PARAM :username
 */

router.param('username', (req: Request, res: Response, next: NextFunction, username: string) => {
  User
    .findOne({username})
    .then((user: IUserModel) => {
      if (!user) {
        return sendNotFound(res, 'User not found');
      }
      req.profile = user;
      return next();
    })
    .catch(next);
});


/**
 * GET /api/profiles/:username
 */
router.get('/:username', authentication.optional, ProfileController.getProfile);


/**
 * POST /api/profiles/:username/follow
 */
router.post('/:username/follow', authentication.required, ProfileController.follow);


/**
 * DELETE /api/profiles/:username/follow
 */
router.delete('/:username/follow', authentication.required, ProfileController.unfollow);


export const ProfilesRoutes: Router = router;
