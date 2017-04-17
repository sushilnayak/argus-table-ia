import {expect} from 'chai';
import Node from '../src/components/tableNode';
import Graph from '../src/components/tableGraph';

describe("Testing Node Class",function(){

	describe("Testing Nodes in following alignment A -> B; A -> C; A -> D",function(){
		var a;

		before(function(){
			a=new Node('A');
			a.addChild(new Node('B'))
			a.addChild(new Node('C'))
			a.addChild(new Node('D'))
		})

    	it('A should have 3 child node',function(done){
    		expect(Object.keys(a.child_nodes).length).to.equal(3)
    		done();
    	})
    	it('A should have 0 parent node',function(done){
    		expect(Object.keys(a.parent_nodes).length).to.equal(0)
    		done();
    	})
	})

    // A -> B -> C
    describe('Testing Nodes in following alignment A -> B -> C',function(){
    	var a,b,c
	    before(function(){

		    a=new Node('A');
		    b=new Node('B');
		    c=new Node('C');

	        a.addChild(b);
	        b.addParent(a);

	        b.addParent(a);
	        b.addChild(c);

	        c.addParent(b);

	    })

    	it('A should have 0 parent node',function(done){
    		expect(Object.keys(a.parent_nodes).length).to.equal(0)
    		done();
    	})

    	it('A should have 1 child node',function(done){
    		expect(Object.keys(a.child_nodes).length).to.equal(1)
    		done();
    	})

    	it('B should have 1 parent node',function(done){
    		expect(Object.keys(b.parent_nodes).length).to.equal(1)
    		done();
    	})

    	it('B should have 1 child node',function(done){
    		expect(Object.keys(b.child_nodes).length).to.equal(1)
    		done();
    	})

    	it('C should have 1 parent node',function(done){
    		expect(Object.keys(c.parent_nodes).length).to.equal(1)
    		done();
    	})

    	it('C should have 0 child node',function(done){
    		expect(Object.keys(c.child_nodes).length).to.equal(0)
    		done();
    	})
    })

    


    // before(function(){
    //     console.log('Runs once before all test in this file')
    // })
    // after(function(){
    //     console.log('Runs once after all test in this file')
    // })

    // beforeEach(function(){
    //     console.log('Runs before every test in this file')
    // })
    // afterEach(function(){
    //     console.log('Runs after every test in this file')
    // })

	// it("First Test",function(done){
	// 	expect(1).to.equal(1);
	// 	done();
	// })
})