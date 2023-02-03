const menuService = require('../services/menuService');

describe('getData', () => {
  it('should return data from all API links', async () => {
    const data = await menuService.getData();
    
    // Check that the function returns an array of data
    expect(Array.isArray(data)).toBe(true);
    
    // Check that the length of the array is equal to the number of API links
    expect(data.length).toBe(8);
    
    // Check that each item in the array is an object with data from an API
    data.forEach(item => {
      expect(typeof item).toBe('object');
    });
  });
});
