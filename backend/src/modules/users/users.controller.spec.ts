import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService = {
    findById: jest.fn(),
    updateProfile: jest.fn(),
    updateSettings: jest.fn(),
    changePassword: jest.fn(),
    deleteAccount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get profile', async () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    mockUsersService.findById.mockResolvedValue(mockUser);

    const result = await controller.getProfile({ user: { id: '1' } });

    expect(result).toEqual(mockUser);
    expect(mockUsersService.findById).toHaveBeenCalledWith('1');
  });

  it('should update profile', async () => {
    const updateDto = { firstName: 'Updated' };
    const mockUser = { id: '1', firstName: 'Updated' };
    mockUsersService.updateProfile.mockResolvedValue(mockUser);

    const result = await controller.updateProfile({ user: { id: '1' } }, updateDto);

    expect(result).toEqual(mockUser);
    expect(mockUsersService.updateProfile).toHaveBeenCalledWith('1', updateDto);
  });

  it('should update settings', async () => {
    const settingsDto = { uiMode: 'dark' };
    const mockUser = { id: '1', uiMode: 'dark' };
    mockUsersService.updateSettings.mockResolvedValue(mockUser);

    const result = await controller.updateSettings({ user: { id: '1' } }, settingsDto);

    expect(result).toEqual(mockUser);
    expect(mockUsersService.updateSettings).toHaveBeenCalledWith('1', settingsDto);
  });

  it('should change password', async () => {
    mockUsersService.changePassword.mockResolvedValue({ message: 'Success' });

    const result = await controller.changePassword({ user: { id: '1' } }, { currentPassword: 'old', newPassword: 'new' });

    expect(result).toEqual({ message: 'Success' });
    expect(mockUsersService.changePassword).toHaveBeenCalledWith('1', 'old', 'new');
  });

  it('should delete account', async () => {
    mockUsersService.deleteAccount.mockResolvedValue({ message: 'Deleted' });

    const result = await controller.deleteAccount({ user: { id: '1' } });

    expect(result).toEqual({ message: 'Deleted' });
    expect(mockUsersService.deleteAccount).toHaveBeenCalledWith('1');
  });
});
