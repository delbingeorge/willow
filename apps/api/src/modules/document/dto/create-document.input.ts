import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateDocumentInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string | null;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  icon?: string;
}
