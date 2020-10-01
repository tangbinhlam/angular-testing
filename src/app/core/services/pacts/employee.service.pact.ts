import { EmployeeService } from '../employee.service';
import { Employee } from '../../../domain/models/employee.model';
import { TestBed, inject, getTestBed, async } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { generateEmployeesMatchers } from './pact-matcher.generator.mock';

let Pact = require('pact-web');
const API_BASE = 'employees/rest/api/v1/';

const expectedEmployees: Employee[] = [
  { id: 1, name: 'Tiger Nixon', salary: 320800, age: 61 },
  { id: 2, name: 'Garrett Winters', salary: 170750, age: 63 },
  { id: 3, name: 'Ashton Cox', salary: 86000, age: 66 },
];

const givenData = {
  status: 'success',
  data: [
    {
      id: 1,
      employee_name: 'Tiger Nixon',
      employee_salary: 320800,
      employee_age: 61,
      profile_image: '',
    },
    {
      id: 2,
      employee_name: 'Garrett Winters',
      employee_salary: 170750,
      employee_age: 63,
      profile_image: '',
    },
    {
      id: 3,
      employee_name: 'Ashton Cox',
      employee_salary: 86000,
      employee_age: 66,
      profile_image: '',
    },
  ],
};

describe('Pact consumer test', () => {
  let provider;

  beforeAll(function (done) {
    //      client = example.createClient('http://localhost:1234')
    provider = Pact({
      consumer: 'employee-client',
      provider: 'employee-service',
      port: 1234,
      //  host: '127.0.0.1',
    });

    // required for slower Travis CI environment
    setTimeout(done, 2000);

    // Required if run with `singleRun: false`
    provider.removeInteractions();
  });

  afterAll(function (done) {
    provider.finalize().then(
      function () {
        done();
      },
      function (err) {
        done.fail(err);
      },
    );
  });

  let service: EmployeeService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [EmployeeService],
    });
    const testbed = getTestBed();
    service = testbed.get(EmployeeService);
  });

  describe('sayHello', () => {
    beforeAll(function (done) {
      provider
        .addInteraction({
          state: `provider get list employee`,
          uponReceiving: 'A request for get employees',
          withRequest: {
            method: 'GET',
            path: `${API_BASE}employees`,
          },
          willRespondWith: {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: generateEmployeesMatchers(expectedEmployees),
          },
        })
        .then(
          function () {
            done();
          },
          function (err) {
            done.fail(err);
          },
        );
    });

    it('should get list employees', function (done) {
      //Run the tests
      service.getEmployees$().subscribe(
        (res) => {
          expect(res).toEqual(expectedEmployees);
          done();
        },
        (err) => {
          done.fail(err);
        },
      );
    });

    // verify with Pact, and reset expectations
    it('successfully verifies', function (done) {
      provider.verify().then(
        function (a) {
          done();
        },
        function (e) {
          done.fail(e);
        },
      );
    });
  });
});
