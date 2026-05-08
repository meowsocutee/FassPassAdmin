import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { RoleMatrixRow, ROLE_MATRIX_DATA } from '../mock-data/role-matrix.mock';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor() { }

  /**
   * Phase 1: Returns mock role matrix data with a simulated network delay.
   * Phase 2: Swap the mock return with the commented HTTP call below.
   */
  getRoleMatrix(): Observable<RoleMatrixRow[]> {
    // Phase 1: Mock — deep clone to allow editing without mutating original
    return of(JSON.parse(JSON.stringify(ROLE_MATRIX_DATA)) as RoleMatrixRow[]).pipe(delay(500));

    /*
    // Phase 2: Backend Integration
    // return this.http.get<RoleMatrixRow[]>('/api/v1/permissions/matrix', { withCredentials: true });
    */
  }

  saveRoleMatrix(data: RoleMatrixRow[]): Observable<void> {
    // Phase 1: Simulate save
    return of(undefined).pipe(delay(600));

    /*
    // Phase 2: Backend Integration
    // return this.http.put<void>('/api/v1/permissions/matrix', data, { withCredentials: true });
    */
  }
}
