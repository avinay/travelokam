angular.module('ionicApp', ['ionic'])
.factory("AppData",function($q,$http){	
	Parse.initialize("xJecl7wfn75gJngmLqt41D08I4JhM82oWJ4IY50O", "kIR9rHnAHkgfL1jJhozNpQSoPH8xD4wY3LVcUI0k");
	var url="http://travelokam.com/";
	return{
		getCats:function(){
			return $http.jsonp(url+"?json=get_category_index", {
                params: {
                    callback: 'JSON_CALLBACK'
                }
            });
			
		},
		getProducts:function(postcount){
			
			return $http.jsonp(url+"?json=get_posts&count="+postcount, {
			
                params: {
                    callback: 'JSON_CALLBACK'
                }
            });
		},	
		getPages:function(){
			var dfrd=$q.defer();
			var pages=[];
			var catObj=Parse.Object.extend("Pages");
			var qry=new Parse.Query(catObj);
			qry.notEqualTo("page_id",'');
			qry.find({
				success:function(res){
					pages=res.map(function(obj){
						return {
							id:obj.get("page_id"),
							title:obj.get("page_title"),
							content:obj.get("page_content"),
							imgs:obj.get("page_imgs"),
						};
					});
					dfrd.resolve(pages);
				},
				error:function(error){
					dfrd.resolve("error");
				}
			});
			return dfrd.promise;
		},
		getPromotions:function(){
			var dfrd=$q.defer();
			var promotions=[];
			var dfrd=$q.defer();
			var catObj=Parse.Object.extend("Promotions");
			var qry=new Parse.Query(catObj);
			qry.notEqualTo("pr_id",'');
			qry.find({
				success:function(res){
					promotions=res.map(function(obj){
						return {
							id:obj.get("pr_id"),
							code:obj.get("pr_code"),
							item:obj.get("pr_item"),
							value:obj.get("pr_value"),
							desc:obj.get("pr_desc")
						};
					});
					dfrd.resolve(promotions);
				},
				error:function(error){
					dfrd.resolve("error");
				}
			});
			return dfrd.promise;
		}
	}
})
  
.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "menu.html",
      controller: 'MenuCtrl'
    })
    .state('menu.tabs', {
      url: "/tab",
      views: {
        'menuContent' :{
          templateUrl: "tabs.html"
        }
      }
    })
    .state('menu.tabs.buttons', {
      url: "/buttons",
      views: {
        'buttons-tab': {
          templateUrl: "buttons.html",
        }
      }
    })
    .state('menu.tabs.list', {
      url: "/list/:catId/:page",
      views: {
        'list-tab': {
          templateUrl: "list.html",
          controller: 'CatController'
        }
      }
    })
	 .state('menu.tabs.cats', {
        url: "/cats",
      views: {
          'list-tab': {
            templateUrl: "cats.html",
        }
      }
    })
	.state('menu.tabs.single-product', {
        url: "/single-product/:postId",
      views: {
          'list-tab': {
            templateUrl: "single-product.html",
			controller: 'SingleProductController'
        }
      }
    })

    .state('menu.tabs.item', {
      url: "/item",
      views: {
          'item-tab': {
          templateUrl: "item.html",
		  controller:"PromotionController"
        }
      }
    })
   .state('menu.tabs.exedash', {
       url: "/exedash",
       views: {
           'exedash-tab': {
               templateUrl: "exedash.html",
			   controller: "PageController"
           }
       }
   })
    .state('menu.tabs.about', {
      url: "/about",
      views: {
        'exedash-tab': {
          templateUrl: "about.html",
		  controller: "PageController"
		  
        }
      }
    });

  $urlRouterProvider.otherwise("menu/tab/buttons");

})

.controller('MenuCtrl', function($scope, $ionicSideMenuDelegate, $ionicModal) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
              
  $ionicModal.fromTemplateUrl('modal.html', function (modal) {
    $scope.modal = modal;
  }, {
    animation: 'slide-in-up'
  });
 })
.controller('ProductController', function($scope,$rootScope,$stateParams) {
	$scope.catId=$stateParams.catId;
	
	var ccats=[$stateParams.catId];
	for(var i=0;i<$rootScope.cats.length;i++){
		if($stateParams.catId==$rootScope.cats[i].pid){
			ccats.push($rootScope.cats[i].name);
		}
	}
	var products=[];
	for(var j=0;j<ccats.length;j++){
		for(var i=0;i<$rootScope.products.length;i++){
			if($rootScope.products[i].cat==ccats[j]){
				products.push($rootScope.products[i]);
			}
		}
	}
	$scope.catProducts=products;
	$scope.dpr=$rootScope.splitArray(products,4);
})
.controller('SingleProductController', function($scope,$rootScope,$stateParams) {
	
		
	for(var i=0;i<$rootScope.posts.length;i++){
		if($stateParams.postId==$rootScope.posts[i].id){
			$scope.post=$rootScope.products[i];
		}
	}
	
}) 
.controller('PageController', function($scope,$rootScope,$stateParams) {

	$scope.pages=$rootScope.pages;
	for (var i=0;i<$scope.pages.length;i++)
	{
		if($scope.pages[i].id=="pg_about"){
			$scope.pabout=$scope.pages[i];
		
		}
		else if ($scope.pages[i].id=="pg_contact_us"){
			$scope.pcontact=$scope.pages[i];
		}
		else if ($scope.pages[i].id=="pg_stores_gallery"){
			$scope.pstore=$scope.pages[i];
		}
	}
	aboutpage="";

}) 
.controller('PromotionController', function($scope,$rootScope,$stateParams) {

	$scope.promotions=$rootScope.promotions;
	
}) 

.controller('CatController', function($scope,$rootScope,$stateParams) {
	var posts=[];
	var catTitle="";
	for (var i=0;i<$rootScope.posts.length;i++){
		for(var j=0;j<$rootScope.posts[i].categories.length;j++)
		{
			if($rootScope.posts[i].categories[j].id+""==$stateParams.catId){
				catTitle=$rootScope.posts[i].categories[j].title;
				posts.push($rootScope.posts[i]);
				
			}
		}
	}
	
	$rootScope.sposts=[];
					
	for(var i=0;i<posts.length;){
		var scat=[];
		for(var j=0;j<$rootScope.ppp;j++){
			if(i<posts.length){
				scat.push(posts[i]);
				i++;
			}
			
		}
		$rootScope.sposts.push(scat);
	}
	page=parseInt($stateParams.page);
	if(page>=0 && page<$rootScope.sposts.length){
		$scope.catTitle=catTitle;
		$scope.childCats=$rootScope.sposts[page];
		$scope.currentpage=page;
		$scope.currentcat=$stateParams.catId;
	}
	
	
	$scope.products=[];
	$scope.dpr=[];
})
.controller('DataCtrl', function($scope,$rootScope,$timeout,AppData) {

	var allCats=function(){
		AppData.getCats().then(function(cats){
				var postcount=0;
				if(cats!="error")
				{
					$rootScope.cats=cats.data.categories;
					console.log($rootScope.cats.length);
					
					for (var i=0;i<$rootScope.cats.length;i++)
					{
						postcount=postcount+$rootScope.cats[i].post_count;
					}
					
					AppData.getProducts(postcount).then(function(posts){
						if(posts!="error")
						{
							
							$rootScope.products=posts.data.posts;
							$rootScope.posts=posts.data.posts;
							$rootScope.productset=true;
							$rootScope.catposts=[];
							for (var i=0;i<$rootScope.cats.length;i++)
							{
								var temp=[];
								for (var j=0;j<$rootScope.posts.length;j++)
								{
									if( $rootScope.posts[j].categories[0].id==$rootScope.cats[i].id){
										
										temp.push($rootScope.cats[i]);
										//console.log("ss2"+ $rootScope.cats[i].id);
										temp.push($rootScope.posts[j]);
										break;
									}
								}
								$rootScope.catposts.push(temp);
								//console.log($rootScope.catposts);
							}
							
						}
						else
						{
							$rootScope.productset=false;
						}
						dataCheck();
					});
					$rootScope.catset=true;
				}
				else
				{
					$rootScope.catset=false;
				}
			});
	}
	var allPosts=function(){
		AppData.getProducts().then(function(posts){
				if(posts!="error")
				{
					
					$rootScope.products=posts.data.posts;
					$rootScope.posts=posts.data.posts;
					$rootScope.productset=true;
				}
				else
				{
					$rootScope.productset=false;
				}
			});
	}
	var allPages=function(){
		AppData.getPages().then(function(pages){
				if(pages!="error")
				{
					$rootScope.pages=pages;
					$rootScope.pageset=true;
				}
				else
				{
					$rootScope.pageset=false;
				}
			});		
	};
	var allPromotions=function(){
		AppData.getPromotions().then(function(promotions){
				if(promotions!="error")
				{
					$rootScope.promotions=promotions;
					$rootScope.promotionset=true;
				}
				else
				{
					$rootScope.promotionset=false;
				}
			});
	};
	$rootScope.splitArray=function(parent,slen){
		var dpr=[];
		var k=0;
		for(var i=0;i<parent.length;){
			var tmp=[];
			for(var j=0;j<slen;j++){
				
				if(i<parent.length){
				tmp[j]=parent[i++];
				}
				else break;
			}
			dpr[k++]=tmp;
		}
		return dpr;
	}
	dataCheck=function(){
	if(!($rootScope.catset) || !($rootScope.productset) ){
			alert("Error connecting to server");
		}
	else{
		 $scope.isVisible = true;
		alert("Loading Completed!");
	}
	
	}
	ionic.Platform.ready(function() {
		$rootScope.ppp=10; //posts per page
		allCats();
		//allPages();
		//allPromotions(); 
		//$timeout(dataCheck,10000);
		
	});
	 
})         