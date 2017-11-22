angular.module('ionic-sidemenu.service', [])
	.directive('ionicSidemenu', function($compile, $timeout) {
		var mhide = 'sidemenuHide';

		function createSquema(tree, element, scope) {
			for (var i in tree) {
				var html = '';
				var el = null;
				var item = tree[i];
				html += '<div ng-show="hide.sidemenuHide' + item.id + '" class="sidemenu-div-item-' + item.level + '"> ';
				html += '<ion-item ';
				if (item.items) {
					html += 'class="sidemenu-subitem-' + item.level + '" ';
					html += 'ng-click="hideMenu(' + item.id + ')"';
					html += '>';
					if (item.icon) {
						html += '<i class="micon-left icon ' + item.icon + '"> </i>';
					}
					html += '<span>' + item.name + '</span>';
					html += '<i class="micon-right micon-right-' + item.level + ' icon" ' +
						' ng-class="hideClass.sidemenuHide' + item.id + ' ? \'ion-plus-round\' : \'ion-minus-round\'"></i>';
					html += '</ion-item>';
					html += '</div>';
					el = $compile(html)(scope);
					element.parent().append(el);
					createSquema(item.items, element, scope);
				} else {
					html += ' menu-close ';
					if (item.state) {
						html += 'ui-sref="' + item.state + '" ';
					}
					html += 'class="sidemenu-subitem-' + item.level + '" ';
					if (item.hide) {}
					html += '>';
					if (item.icon) {
						html += '<i class="micon-left icon ' + item.icon + '"> </i>';
					}
					html += '<span>' + item.name + '</span>';
					html += '</ion-item>';
					html += '</div>';
					el = $compile(html)(scope);
					element.parent().append(el);
					continue;
				}
			}
		}

		function prepareHideTree(tree, scope) {
			for (var i in tree) {
				if (tree[i].items) {
					var name = mhide + tree[i].id;
					scope.hideClass[name] = true;
					prepareHideTree(tree[i].items, scope);
				} else {
					continue;
				}
			}
		}

		function searchTree(id, tree, x) {
			var found = false;
			var i = 0;
			for (i in tree) {
				var item = tree[i];
				if (item.id === id) {
					found = true;
					return item.items;
				}
			}
			if (!found) {
				for (x in tree) {
					var mx = x;
					mx++;
					return searchTree(id, tree[x].items, mx);
				}
			}
		}
		return {
			restrict: 'E',
			scope: {
				tree: '='
			},
			controller: function($scope, $element) {
				createSquema($scope.tree, $element, $scope);
				$scope.hide = {};
				$scope.hideClass = {};
				for (var i in $scope.tree) {
					var name = mhide + $scope.tree[i].id;
					$scope.hide[name] = true;
					$scope.hideClass[name] = true;
				}
				prepareHideTree($scope.tree, $scope);
				$scope.hideMenu = function(id) {
					var tree = searchTree(id, $scope.tree, 0);
					var name = mhide + id;
					$scope.hideClass[name] = !$scope.hideClass[name];
					var item = null;
					var mname = null;
					if (!$scope.hideClass[name]) {
						angular.forEach(tree, function(item, key) {
							$timeout(function() {
								mname = mhide + item.id;
								$scope.hide[mname] = true;
							}, 10);
						});
					} else {
						angular.forEach($scope.hide, function(item, key) {
							$timeout(function() {
								var name = mhide + id;
								if (key.length > name.length && key.indexOf(name) != -1) {
									if (item) {
										$scope.hide[key] =false;
										$scope.hideClass[key] =true;
									}
								}
							}, 10);
						});
					}
				};
			}
		};
	});