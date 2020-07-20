import { UntilDestroy } from '@ngneat/until-destroy';

export function ConnectState() {
  return (target: any) => {
    return UntilDestroy()(target);
  };
}