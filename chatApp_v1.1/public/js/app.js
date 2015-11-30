angular.module('crudApp',['ngMaterial']);
angular.module('crudApp').controller('tableCtrl',tableCtrl);

function tableCtrl($scope,$http){
  var refresh = function(){
    $http.get('/getList').success(function(response){
      $scope.contactList = response;
      $scope.contactParams = "";
    });
  }

  refresh();

  $scope.addContact = function() {
    console.log($scope.contactParams);
    $http.post('/addContact',$scope.contactParams).success(function(response){
      console.log(response);
      refresh();
    });
  }

  $scope.deleteContact = function(id){
        $http.delete('/deleteContact/'+id).success(function(response){
          console.log(response);
          refresh();
        });
  }

  $scope.editContact = function(id){
    console.log(id);
    $http.get('/editContact/'+id).success(function(response){
      $scope.contactParams= response;
      console.log(response);

    })
  }

  $scope.updateContact = function(){
  //  alert($scope.contactParams._id);
     $http.put('/updateContact/'+$scope.contactParams._id,$scope.contactParams).success(function(response){
       console.log(response);
       refresh();
     });
  }

  $scope.clear = function(){
    $scope.contactParams = "";
  }
}
