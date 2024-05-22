/* eslint-disable prettier/prettier */
import { IsBoolean, IsDate, IsEnum, IsIn, IsNumber, IsOptional, IsString, IsUUID, MinLength, isEnum } from 'class-validator';

export class FilterDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	lastName?: string;
	
	@IsOptional()
	@IsString()
	fullName?: string;

	@IsOptional()
	@IsString()
	ci?: string;

	@IsOptional()
	@IsString()
	email?: string;

	@IsOptional()
	@IsString()
	phone?: string;

	@IsOptional()
	@IsString()
	address?: string;

	@IsOptional()
	@IsString()
	nationality?: string;

	@IsOptional()
	@IsIn(['true', 'false', true, false])
	isActive?: boolean | string;

	@IsOptional()
	@IsNumber()
	limit?: number;

	@IsOptional()
	@IsNumber()
	page?: number;
}

export class FilterChargeDto {
	@IsOptional()
	@IsString()
	@MinLength(3)
	name?: string;

	@IsOptional()
	@IsIn(['true', 'false', true, false])
	isActive?: boolean | string;

	@IsOptional()
	@IsNumber()
	limit?: number;

	@IsOptional()
	@IsNumber()
	page?: number;
}

export class FilterScheduleDto {
	@IsOptional()
	@IsString()
	@MinLength(3)
	name?: string;

	@IsOptional()
	@IsIn(['true', 'false', true, false])
	isActive?: boolean | string;

	@IsOptional()
	@IsNumber()
	limit?: number;

	@IsOptional()
	@IsNumber()
	page?: number;
}

export class FilterLicenseDto {
	@IsOptional()
	@IsString()
	@MinLength(3)
	licenseType?: string;

	@IsOptional()
	@IsIn(['true', 'false', true, false])
	isActive?: boolean | string;

	@IsOptional()
	@IsNumber()
	limit?: number;

	@IsOptional()
	@IsNumber()
	page?: number;
}

export class FilterReportAttendace {
	@IsDate()
	initialDate: Date;

	@IsDate()
	endDate: Date;

	@IsUUID()
	@IsString()
	personalId: string;
}