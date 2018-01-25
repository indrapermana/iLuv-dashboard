$(document).ready(function(){
    $('.delete-event').on('click', function(){
        var id = $(this).data('id');
        var url = '/events/delete/'+id;
        if (confirm('Delete event?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting event...');
                    window.location.href='/events';
                },
                error: function(err){
                    console.log('err');
                }
            });
        }
    });

    $('.delete-product').on('click', function(){
        var id = $(this).data('id');
        var url = '/products/delete/'+id;
        if (confirm('Delete product?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting product...');
                    window.location.href='/products';
                },
                error: function(err){
                    console.log('err');
                }
            });
        }
    });

    $('.delete-brand').on('click', function(){
        var id = $(this).data('id');
        var url = '/brands/delete/'+id;
        if (confirm('Delete brand?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting brand...');
                    window.location.href='/brands';
                },
                error: function(err){
                    console.log('err');
                }
            });
        }
    });
});